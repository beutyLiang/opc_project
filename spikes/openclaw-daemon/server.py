"""Spike server — FastAPI app exposing OpenAI-compatible /v1/chat/completions.

This is the entry point. OpenClaw Daemon points here as a 'provider',
and we transparently proxy to Coze behind the scenes.
"""

import logging
import sys
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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
    temperature: float = 0.7
    max_tokens: int | None = None


# ── Routes ──────────────────────────────────────────────────
@app.get("/health")
async def health_check() -> dict[str, str]:
    """Basic liveness probe."""
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


@app.post("/v1/chat/completions")
async def chat_completions(
    request: ChatCompletionRequest,
) -> JSONResponse:
    """OpenAI-compatible Chat Completions endpoint.

    This is the endpoint OpenClaw Daemon will call.
    We translate the request to Coze format, get the reply,
    and wrap it back in OpenAI format.
    """
    logger.info(
        "Received chat completion request: model=%s, messages=%d",
        request.model,
        len(request.messages),
    )

    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        result = await handle_chat_completion(
            messages=messages,
            coze_client=app.state.coze_client,
        )
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


# ── Entrypoint ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host=HOST,
        port=PORT,
        log_level=LOG_LEVEL,
        reload=True,
    )
