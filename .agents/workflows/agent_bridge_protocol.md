---
description: 跨 Agent 异步通信规约 (Agent Bridge)
---
# 跨 Agent 异步通信规约
- 脚本路径：d:\projects\AgentBridge\agent_comm.py
- 执行 Cwd：d:\projects\AgentBridge
- 默认频道：agent-bridge-dev
- 身份：zimo（子默）
- 发送：python d:\projects\AgentBridge\agent_comm.py send --thread agent-bridge-dev --msg "[To 目标] 消息内容"
- 检查：python d:\projects\AgentBridge\agent_comm.py check
- 历史：python d:\projects\AgentBridge\agent_comm.py history --thread agent-bridge-dev
- 注意：消息开头加 [To 恺撒] 等标识；长内容存为文件后发路径；Cwd 必须为 d:\projects\AgentBridge
