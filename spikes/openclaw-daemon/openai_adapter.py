"""OpenAI-compatible adapter — wraps Coze responses in OpenAI Chat Completions format.

This is the core of the Spike: proving that OpenClaw can talk to Coze
through a thin Python adapter that speaks the OpenAI protocol.
"""

import time
import uuid
from typing import Any

from coze_client import CozeClient


def build_openai_response(
    content: str,
    model: str = "coze-wuxing-bot",
) -> dict[str, Any]:
    """Package a plain text reply as an OpenAI Chat Completions response."""
    return {
        "id": f"chatcmpl-{uuid.uuid4().hex[:12]}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": model,
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": content,
                },
                "finish_reason": "stop",
            }
        ],
        "usage": {
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0,
        },
    }


async def handle_chat_completion(
    messages: list[dict[str, str]],
    coze_client: CozeClient,
) -> dict[str, Any]:
    """Process an OpenAI-style request and return an OpenAI-style response.

    Extracts the last user message, sends it to Coze, wraps the reply.
    """
    user_message = _extract_last_user_message(messages)
    bot_reply = await coze_client.chat(user_message)
    return build_openai_response(bot_reply)


def _extract_last_user_message(
    messages: list[dict[str, str]],
) -> str:
    """Walk backwards through messages to find the last user utterance."""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            return msg.get("content", "")
    raise ValueError("No user message found in request")
