# 初序 OPC 项目规则
# 全局规则见 C:\Users\Administrator\.claude\CLAUDE.md（自动加载）
# 本文件仅包含 OPC 项目专属配置

## 项目信息
- **项目名称**：初序 OPC · AI 健康一人公司
- **参赛名称**：初序 · AI 健康节律智能体
- **赛事**：第五届琶洲算法大赛 · AI创新应用赛 · "超级龙虾"OPC挑战赛
- **复审结果**：✅ 2026-05-07 终审通过，已进入入驻执行阶段
- **当前阶段**：文档定稿完成，即将进入 Phase 0 编码实战

## 通信频道
- **本项目频道**：`agent-bridge-dev` — 所有 OPC 项目通信使用此频道
- **文件共享铁律**：必须 git push 到 AgentBridge/shared/ 后通知对方，严禁发送本地绝对路径

## 核心定位
> **"一个人 + AI = 一家年省千万的健康服务公司"**
> 基于真实运营数据（岐黄学社）验证的AI替代人工方案。通过"三级漏斗 Agent 矩阵"（AI健康管家→AI社群助教→AI商城导购），结合 B 端 OPC OS 数据中台，将 500 人客服团队的私域运营成本砍掉 98%。

## 技术栈（v1.4 定稿 · 2026-05-10）
- **消息通道**：企微·微信客服（kf_account）+ RPA 沉默用户激活（混合架构 v1.3）
- **Agent 编排层**：**LangGraph**（状态机 + 图结构，管理对话流转、打断恢复、Human-in-the-loop）
- **Agent 组件层**：**LangChain**（ChatModel / Retriever / Tool 定义 / Document Loader）
- **LLM 模型**：DeepSeek V4 Flash（全国产、数据不出境）
- **记忆系统**：Mem0（待 Spike 验证）
- **知识库/向量库**：RAG + pgvector（MemFire Cloud PostgreSQL）
- **消息网关**：自建 FastAPI（kf 回调 / 路由 / 推送调度）
- **状态持久化**：LangGraph Checkpointer → MemFire PostgreSQL
- **前端**：纯 HTML/CSS/JS + PWA
- **部署**：GitHub Pages

> **重要**：LangGraph 与 LangChain 是**分层协作**关系。LangGraph = 编排层，LangChain = 组件层。废弃的是传统 AgentExecutor 线性调度，不是废弃 LangChain。

## 核心文档索引（v1.4 定稿）
| 文档 | 路径 | 状态 |
|------|------|------|
| 客服智能体落地方案 v2.0 | `docs/初序健康_客服智能体落地方案_20260508.md` | 🟢 通过 |
| 全链路业务技术对照表 | `docs/初序健康_全链路业务技术对照表_20260509.md` | 🟢 通过 |
| 技术实现说明书 | `docs/初序健康_技术实现说明书_20260509.md` | 🟢 通过 |
| 消息架构决策演进全记录 | `docs/初序健康_消息架构决策演进全记录_20260510.md` | 🟢 通过 |
| Agent框架选型调研报告 v2 | `docs/Agent底层框架选型调研报告_20260510.md` | 🟡 v2 已修订 |
| 完整上下文 | `context_memory/CONTEXT.md` | 📋 持续更新 |

## 核心记忆指针
- **最新商业计划书**：`docs/初序健康_商业计划书_终版_20260504.md`
- **真实运营数据**：`docs/岐黄学社_真实运营数据_20260504.md`
- **完整上下文**：`context_memory/CONTEXT.md`
- **变更日志**：`context_memory/CHANGELOG.md`

## 下一步行动（Phase 0）
1. LangGraph 编码实战：基于状态图编写核心对话流（闲聊→问诊→推荐）
2. FastAPI 网关对接：kf 回调 → `graph.ainvoke(state)`
3. Mem0 Spike 验证：Docker 部署 + 20 条对话测试
4. RPA 联调：监控 `rpa_queue` 执行成功率

## 关联项目
- 主项目（初序日常）：`d:\projects\test`
- 归元（海外IP）：`d:\projects\yuanmind`
