"""Coze API client — handles async chat creation, polling, and message retrieval."""

import asyncio
import logging
import uuid

import httpx

from config import (
    COZE_BOT_ID,
    COZE_CHAT_ENDPOINT,
    COZE_CHAT_MESSAGE_LIST_ENDPOINT,
    COZE_CHAT_RETRIEVE_ENDPOINT,
    COZE_PAT,
    MAX_POLL_ATTEMPTS,
    POLL_INTERVAL_SECONDS,
)

logger = logging.getLogger(__name__)


class CozeClientError(Exception):
    """Raised when Coze API returns an unexpected response."""


class CozeClient:
    """Thin async wrapper around Coze /v3/chat endpoints."""

    def __init__(
        self,
        pat: str = COZE_PAT,
        bot_id: str = COZE_BOT_ID,
    ) -> None:
        if not pat or not bot_id:
            raise CozeClientError("COZE_PAT and COZE_BOT_ID must be set in .env")
        self._pat = pat
        self._bot_id = bot_id
        self._headers = {
            "Authorization": f"Bearer {self._pat}",
            "Content-Type": "application/json",
        }

    async def chat(self, user_message: str) -> str:
        """Send a message and block until the bot replies.

        Coze /v3/chat is async by design: it returns a chat_id,
        then we poll /v3/chat/retrieve until status == 'completed',
        then fetch the bot reply from /v3/chat/message/list.
        """
        user_id = str(uuid.uuid4())[:8]

        async with httpx.AsyncClient(timeout=30.0) as client:
            # Step 1 — create chat
            chat_id, conversation_id = await self._create_chat(
                client, user_message, user_id
            )

            # Step 2 — poll until completed
            await self._poll_until_completed(client, chat_id, conversation_id)

            # Step 3 — fetch bot reply
            return await self._fetch_bot_reply(client, chat_id, conversation_id)

    async def _create_chat(
        self,
        client: httpx.AsyncClient,
        message: str,
        user_id: str,
    ) -> tuple[str, str]:
        """POST /v3/chat — returns (chat_id, conversation_id)."""
        payload = {
            "bot_id": self._bot_id,
            "user_id": user_id,
            "stream": False,
            "auto_save_history": False,
            "additional_messages": [
                {
                    "role": "user",
                    "content": message,
                    "content_type": "text",
                }
            ],
        }
        resp = await client.post(
            COZE_CHAT_ENDPOINT,
            headers=self._headers,
            json=payload,
        )
        resp.raise_for_status()
        data = resp.json()

        if data.get("code") != 0:
            raise CozeClientError(f"Coze create chat failed: {data.get('msg')}")

        chat_data = data.get("data", {})
        chat_id = chat_data.get("id", "")
        conversation_id = chat_data.get("conversation_id", "")

        if not chat_id or not conversation_id:
            raise CozeClientError(f"Missing chat_id or conversation_id: {data}")

        logger.info(
            "Chat created: chat_id=%s, conversation_id=%s",
            chat_id,
            conversation_id,
        )
        return chat_id, conversation_id

    async def _poll_until_completed(
        self,
        client: httpx.AsyncClient,
        chat_id: str,
        conversation_id: str,
    ) -> None:
        """Poll /v3/chat/retrieve until status is 'completed'."""
        for attempt in range(MAX_POLL_ATTEMPTS):
            resp = await client.get(
                COZE_CHAT_RETRIEVE_ENDPOINT,
                headers=self._headers,
                params={
                    "chat_id": chat_id,
                    "conversation_id": conversation_id,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            status = data.get("data", {}).get("status", "")

            if status == "completed":
                logger.info("Chat completed after %d polls", attempt + 1)
                return

            if status in ("failed", "requires_action"):
                raise CozeClientError(f"Chat ended with status '{status}': {data}")

            await asyncio.sleep(POLL_INTERVAL_SECONDS)

        raise CozeClientError(f"Chat timed out after {MAX_POLL_ATTEMPTS} polls")

    async def _fetch_bot_reply(
        self,
        client: httpx.AsyncClient,
        chat_id: str,
        conversation_id: str,
    ) -> str:
        """GET /v3/chat/message/list — extract the bot 'answer' message."""
        resp = await client.get(
            COZE_CHAT_MESSAGE_LIST_ENDPOINT,
            headers=self._headers,
            params={
                "chat_id": chat_id,
                "conversation_id": conversation_id,
            },
        )
        resp.raise_for_status()
        data = resp.json()

        messages = data.get("data", [])
        for msg in messages:
            if msg.get("role") == "assistant" and msg.get("type") == "answer":
                return msg.get("content", "")

        # Fallback: return any assistant message
        for msg in messages:
            if msg.get("role") == "assistant":
                return msg.get("content", "")

        raise CozeClientError(f"No bot reply found in messages: {messages}")
