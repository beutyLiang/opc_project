"""Spike server — FastAPI app exposing OpenAI-compatible /v1/chat/completions.

This is the entry point. OpenClaw Daemon points here as a 'provider',
and we transparently proxy to Coze behind the scenes.

Restored to original working version + streaming support.
"""

import asyncio
import json
import logging
import os
import sys
import uuid
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from config import HOST, LOG_LEVEL, PORT
from coze_client import CozeClient, CozeClientError
from openai_adapter import handle_chat_completion

# ── Logging ─────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


# ── Lifespan ────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Validate credentials on startup, fail fast if missing."""
    try:
        app.state.coze_client = CozeClient()
        logger.info("Coze client initialized successfully")
    except CozeClientError as exc:
        logger.error("Startup failed: %s", exc)
        raise SystemExit(1) from exc
    yield


# ── App ─────────────────────────────────────────────────────
app = FastAPI(
    title="OpenClaw ↔ Coze Adapter (Spike)",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request Schema ──────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str


class ChatCompletionRequest(BaseModel):
    model: str = "coze-wuxing-bot"
    messages: list[ChatMessage]
    stream: bool = False
    temperature: float = 0.7
    max_tokens: int | None = None


# ── Routes ──────────────────────────────────────────────────
@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check for deployment."""
    return {"status": "ok"}


@app.get("/v1/models")
async def list_models() -> dict[str, Any]:
    """Minimal /v1/models for OpenClaw provider discovery."""
    return {
        "object": "list",
        "data": [
            {
                "id": "coze-wuxing-bot",
                "object": "model",
                "owned_by": "coze-adapter",
            }
        ],
    }


# Global state for spike
current_conversation_id = None

@app.post("/v1/chat/completions")
async def chat_completions(
    request: ChatCompletionRequest,
) -> Any:
    """OpenAI-compatible Chat Completions endpoint."""
    global current_conversation_id
    
    logger.info(
        "Received chat completion request: model=%s, messages=%d, stream=%s",
        request.model,
        len(request.messages),
        request.stream,
    )

    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]

        # Extract last user message
        user_message = ""
        for msg in reversed(messages):
            if msg["role"] == "user":
                user_message = msg["content"].strip()
                break

        if not user_message:
            raise ValueError("No user message found in request")

        # ── Intent Interceptor + Session Detection ──
        is_new_session = False
        non_system = [m for m in messages if m["role"] != "system"]
        if len(non_system) <= 1:
            is_new_session = True

        MENU_KEYWORDS = {
            "吃什么": "今天吃什么", "饮食": "今天吃什么",
            "测体质": "测我的体质，请每次只问我一道题，等我回答后再出下一题",
            "体质": "测我的体质，请每次只问我一道题，等我回答后再出下一题",
            "测评": "测我的体质，请每次只问我一道题，等我回答后再出下一题",
            "拍照": "拍照识食", "识食": "拍照识食",
            "不舒服": "身体不舒服", "症状": "身体不舒服",
        }
        MENU_NUMBERS = {
            "1": "今天吃什么",
            "2": "测我的体质，请每次只问我一道题，等我回答后再出下一题",
            "3": "拍照识食",
            "4": "身体不舒服",
        }

        if user_message in MENU_NUMBERS:
            user_message = MENU_NUMBERS[user_message]
            is_new_session = True
        else:
            for kw, expansion in MENU_KEYWORDS.items():
                if kw in user_message and len(user_message) <= 8:
                    user_message = expansion
                    is_new_session = True
                    break

        if is_new_session:
            current_conversation_id = None
            logger.info("New session detected. Clearing conversation_id.")

        # Expand single-letter quiz answers
        if not is_new_session and len(user_message) == 1 and user_message.isalpha():
            user_message = f"我选{user_message.upper()}"

        logger.info(
            "Dispatching to Coze: msg=%s, cid=%s", 
            user_message[:50], 
            current_conversation_id
        )

        if request.stream:
            async def event_stream():
                global current_conversation_id
                
                bot_reply, new_cid = await app.state.coze_client.chat(
                    user_message, conversation_id=current_conversation_id
                )
                
                # Update global conversation ID
                current_conversation_id = new_cid

                chunk_id = f"chatcmpl-{uuid.uuid4().hex[:12]}"
                for char in bot_reply:
                    chunk = {
                        "id": chunk_id,
                        "object": "chat.completion.chunk",
                        "choices": [{"delta": {"content": char}}],
                    }
                    yield f"data: {json.dumps(chunk, ensure_ascii=False)}\n\n"
                    await asyncio.sleep(0.01)

                yield "data: [DONE]\n\n"

            return StreamingResponse(event_stream(), media_type="text/event-stream")
        else:
            # For non-streaming fallback, modify to unwrap tuple if needed.
            bot_reply, new_cid = await app.state.coze_client.chat(
                user_message, conversation_id=current_conversation_id
            )
            current_conversation_id = new_cid
            
            from openai_adapter import build_openai_response
            result = build_openai_response(bot_reply, request.model)
            return JSONResponse(content=result)

    except CozeClientError as exc:
        logger.error("Coze API error: %s", exc)
        raise HTTPException(
            status_code=502,
            detail=f"Coze API error: {exc}",
        ) from exc
    except ValueError as exc:
        logger.error("Bad request: %s", exc)
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


# ── Mount Frontend ──────────────────────────────────────────
frontend_dir_cloud = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "frontend"
)
frontend_dir_local = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend"
)

if os.path.isdir(frontend_dir_cloud):
    app.mount(
        "/", StaticFiles(directory=frontend_dir_cloud, html=True), name="frontend"
    )
elif os.path.isdir(frontend_dir_local):
    app.mount(
        "/", StaticFiles(directory=frontend_dir_local, html=True), name="frontend"
    )
else:
    logger.warning("Frontend directory not found. Static site will not be served.")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host=HOST,
        port=PORT,
        log_level=LOG_LEVEL,
        reload=True,
    )
