"""Spike configuration — all magic numbers and URLs live here."""

import os

from dotenv import load_dotenv

load_dotenv()

# ── Coze API ────────────────────────────────────────────────
COZE_BASE_URL: str = os.getenv("COZE_BASE_URL", "https://api.coze.cn")
COZE_PAT: str = os.getenv("COZE_PAT", "")
COZE_BOT_ID: str = os.getenv("COZE_BOT_ID", "")

# ── Server ──────────────────────────────────────────────────
HOST: str = os.getenv("HOST", "0.0.0.0")
PORT: int = int(os.getenv("PORT", "8000"))
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")

# ── Coze API Endpoints ─────────────────────────────────────
COZE_CHAT_ENDPOINT: str = f"{COZE_BASE_URL}/v3/chat"
COZE_CHAT_RETRIEVE_ENDPOINT: str = f"{COZE_BASE_URL}/v3/chat/retrieve"
COZE_CHAT_MESSAGE_LIST_ENDPOINT: str = f"{COZE_BASE_URL}/v3/chat/message/list"

# ── Polling ─────────────────────────────────────────────────
POLL_INTERVAL_SECONDS: float = 0.5
MAX_POLL_ATTEMPTS: int = 120  # 60s max wait
