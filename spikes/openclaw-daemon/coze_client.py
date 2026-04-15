"""Coze API client — handles async chat creation, polling, and message retrieval.

Restored to the original working version (2026-04-11).
Each call sends only the last user message with auto_save_history=True.
"""

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

    async def chat(self, user_message: str, conversation_id: str | None = None) -> tuple[str, str]:
        """Send a message and block until the bot replies.
        
        Returns (bot_reply, conversation_id)
        """
        user_id = "openclaw-demo-user"

        async with httpx.AsyncClient(timeout=30.0) as client:
            chat_id, new_conversation_id = await self._create_chat(
                client, user_message, user_id, conversation_id
            )
            await self._poll_until_completed(client, chat_id, new_conversation_id)
            bot_reply = await self._fetch_bot_reply(client, chat_id, new_conversation_id)
            return bot_reply, new_conversation_id

    async def _create_chat(
        self,
        client: httpx.AsyncClient,
        message: str,
        user_id: str,
        conversation_id: str | None,
    ) -> tuple[str, str]:
        """POST /v3/chat — returns (chat_id, conversation_id)."""
        payload = {
            "bot_id": self._bot_id,
            "user_id": user_id,
            "stream": False,
            "auto_save_history": True,
            "additional_messages": [
                {
                    "role": "user",
                    "content": message,
                    "content_type": "text",
                }
            ],
        }
        
        params = {}
        if conversation_id:
            params["conversation_id"] = conversation_id

        resp = await client.post(
            COZE_CHAT_ENDPOINT,
            headers=self._headers,
            params=params,
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
                last_error = data.get("data", {}).get("last_error", {})
                raise CozeClientError(
                    f"Chat ended with status '{status}': {last_error}"
                )

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
