"""Test: stream mode + full history in additional_messages."""

import asyncio
import json
import sys

import httpx

sys.path.insert(0, ".")
from config import COZE_BOT_ID, COZE_PAT

HEADERS = {
    "Authorization": f"Bearer {COZE_PAT}",
    "Content-Type": "application/json",
}
BASE = "https://api.coze.cn"


async def stream_chat(client, msgs):
    """Send chat with stream=true, return full reply text."""
    async with client.stream(
        "POST",
        f"{BASE}/v3/chat",
        headers=HEADERS,
        json={
            "bot_id": COZE_BOT_ID,
            "user_id": "test-stream-hist",
            "stream": True,
            "auto_save_history": True,
            "additional_messages": msgs,
        },
    ) as resp:
        resp.raise_for_status()
        full_reply = ""
        event_type = ""
        async for line in resp.aiter_lines():
            line = line.strip()
            if line.startswith("event:"):
                event_type = line[6:].strip()
            elif line.startswith("data:"):
                raw = line[5:].strip()
                if not raw or raw == "[DONE]":
                    continue
                try:
                    data = json.loads(raw)
                except json.JSONDecodeError:
                    continue
                if event_type == "conversation.message.delta":
                    if data.get("role") == "assistant" and data.get("type") == "answer":
                        full_reply += data.get("content", "")
        return full_reply


async def main():
    sys.stdout.reconfigure(encoding="utf-8")

    history = []

    async with httpx.AsyncClient(timeout=120) as c:
        print("=== Full history via additional_messages (stream mode) ===\n")

        # Turn 1
        history.append({"role": "user", "content": "帮我测测体质", "content_type": "text"})
        reply1 = await stream_chat(c, list(history))
        history.append({"role": "assistant", "content": reply1, "content_type": "text"})
        print(f"Turn1: {reply1[:200]}\n")

        # Turn 2
        history.append({"role": "user", "content": "A", "content_type": "text"})
        reply2 = await stream_chat(c, list(history))
        history.append({"role": "assistant", "content": reply2, "content_type": "text"})
        print(f"Turn2: {reply2[:200]}\n")

        # Turn 3
        history.append({"role": "user", "content": "1", "content_type": "text"})
        reply3 = await stream_chat(c, list(history))
        print(f"Turn3: {reply3[:200]}\n")


if __name__ == "__main__":
    asyncio.run(main())
