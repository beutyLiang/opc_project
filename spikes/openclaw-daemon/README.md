# OpenClaw ↔ Coze Adapter (48h Spike)

> **轨道 A** | Python/FastAPI | 验证 OpenClaw Daemon 通过适配器对接 Coze API

## 架构

```
OpenClaw Daemon ──→ /v1/chat/completions ──→ 本适配器 ──→ Coze /v3/chat ──→ Bot 回复
       ↑                                         │
       └───── OpenAI 协议格式 ←── 包装返回 ←──────┘
```

## 快速启动

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入真实的 COZE_PAT 和 COZE_BOT_ID

# 3. 启动服务
python server.py
```

服务启动后监听 `http://0.0.0.0:8000`。

## API 端点

| 方法 | 路径 | 说明 |
|:---|:---|:---|
| GET | `/health` | 健康检查 |
| GET | `/v1/models` | 模型列表（供 OpenClaw 发现） |
| POST | `/v1/chat/completions` | 核心端点，OpenAI 兼容 |

## 测试

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"coze-wuxing-bot","messages":[{"role":"user","content":"我想测测体质"}]}'
```

## 文件结构

```
spikes/openclaw-daemon/
├── server.py           ← FastAPI 入口
├── coze_client.py      ← Coze API 异步客户端
├── openai_adapter.py   ← OpenAI 协议包装层
├── config.py           ← 配置常量（从 .env 加载）
├── requirements.txt    ← Python 依赖
├── .env.example        ← 环境变量模板
└── README.md           ← 你正在读的文件
```
