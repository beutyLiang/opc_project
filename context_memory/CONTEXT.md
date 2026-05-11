# 项目上下文

## 项目信息
- **项目名称**：初序 OPC · AI 健康一人公司
- **参赛名称**：初序 · AI 健康节律智能体 (Chuxu AI Health Rhythm Agent)
- **赛事**：第五届琶洲算法大赛 · AI创新应用赛 · "超级龙虾"OPC挑战赛
- **复审结果**：✅ 2026-05-07 终审通过，已进入入驻执行阶段

## 身份信息
- **用户名字**：Zoey（CEO，42岁，海珠区本地创业者）
- **AI 名字**：子默（Zimo），COO/CTO，**Claude Opus 4.6 / Antigravity 平台**
- **AI 名字**：凯撒（Caesar），执行官，Gemini / Antigravity 平台
- **AI 名字**：知远（Zhiyuan），CRO/首席研究官，Gemini
- **AI 名字**：明哲（Mingzhe），CMO，ChatGPT
- **关系**：Zoey是老板/CEO，子默定方向+审结果，凯撒执行落地，知远做调研，明哲写文案

## 技术栈（v1.4 定稿 · 2026-05-10）
- **消息通道**：企微·微信客服（kf_account）+ RPA 沉默用户激活（混合架构 v1.3）
- **Agent 编排层**：**LangGraph**（状态机 + 图结构，管理对话流转、打断恢复、Human-in-the-loop）
- **Agent 组件层**：**LangChain**（ChatModel / Retriever / Tool 定义 / Document Loader 等底层组件）
- **LLM 模型**：DeepSeek V4 Flash（全国产、数据不出境）
- **记忆系统**：Mem0（待 Spike 验证）
- **知识库**：RAG + pgvector（MemFire Cloud PostgreSQL）
- **消息网关**：自建 FastAPI（kf 回调 / 路由 / 推送调度）
- **状态持久化**：LangGraph Checkpointer → MemFire PostgreSQL
- **通信**：AgentBridge（GitHub 中转异步通信）
- **前端**：纯 HTML/CSS/JS（零 Node 依赖），PWA 架构
- **部署**：GitHub Pages（opc_demo + frontend + token_calculator）

> **重要澄清**：LangGraph 与 LangChain 是**分层协作**关系——LangGraph 是编排层，LangChain 是组件层。不是"替代"，而是"升级编排方式"。废弃的是传统 AgentExecutor 线性调度。

## 关键决策（按时间倒序）
- [HIGH] 2026-05-10: 引入 LangGraph 作为编排层，废弃传统 AgentExecutor，全面采用状态机架构（v1.4）
- [HIGH] 2026-05-10: 完成框架选型调研报告 v2、四份核心文档全部通过审核（子默2号 6 轮审核 + 2 轮框架审核）
- [HIGH] 2026-05-10: 消息架构 v1.3 混合架构定稿（kf_account + RPA），经历 7 次迭代、6 轮审核
- [HIGH] 2026-05-09: 完成《全链路业务技术对照表》和《技术实现说明书》
- [HIGH] 2026-05-08: 确定企微·微信客服（kf_account）为主通道，SCRM 方案已废弃
- [HIGH] 2026-05-07: OPC 琶洲超级龙虾终审正式通过
- [HIGH] 2026-05-04: 确立"三级漏斗Agent矩阵"架构（管家→助教→导购）
- [MED] 2026-05-04: 岐黄学社真实运营数据已采集（500人/200万/日引1万/30%转化/50%复购）

## 编码规范（最多 8 条）
- [HIGH] **Agent Bridge 铁律：所有跨 Agent 的文件传递必须 git add + commit + push 到 AgentBridge 仓库。绝对不能只做本地复制——各 Agent 在不同物理机器上，只有 Git 仓库是共享的。消息中严禁发送本地绝对路径（C/D/E盘），必须使用 Git 相对路径。**
- [HIGH] docs/ 被 .gitignore 忽略，需 git add -f 强制推送
- [HIGH] 跨Agent通信走AgentBridge，文件放 shared/ 目录并 git push
- [HIGH] PowerShell 中命令用分号(;)分隔，不能用 &&
- [MED] Python 用类型提示 + Black 格式化

## 🔴 跨Agent通信频道
- `agent-bridge-dev` — **当前活跃频道**
- 通信铁律：所有跨Agent消息不超过5行
- 文件共享：放 AgentBridge/shared/ 目录，**必须 git push 后再通知对方**

## 🔴 合规红线
1. **不冒充医生** — 所有健康建议附免责声明，不做诊断
2. **用户数据隐私** — 健康数据合规存储（用户授权+加密+不出境）
3. **AI标识义务** — 用户必须知道在跟AI聊天
4. **规则：任何新功能上线前，必须过一遍红线**

## 项目结构
- `frontend/` — C端初序健康管家（index.html + shop.html + report-preview.html）
- `opc_demo/` — B端OPC运营后台（已换皮为"初序私域管理后台"）
- `docs/` — 所有方案文档（被.gitignore忽略，需-f强制推）
- `context_memory/` — 项目记忆系统
- `token_calculator.html` — Token 成本计算器（已部署至 GitHub Pages）

## 核心文档索引（v1.4 定稿）
| 文档 | 路径 | 状态 |
|------|------|------|
| 客服智能体落地方案 v2.0 | `docs/初序健康_客服智能体落地方案_20260508.md` | 🟢 审核通过 |
| 全链路业务技术对照表 | `docs/初序健康_全链路业务技术对照表_20260509.md` | 🟢 审核通过 |
| 技术实现说明书 | `docs/初序健康_技术实现说明书_20260509.md` | 🟢 审核通过 |
| 消息架构决策演进全记录 | `docs/初序健康_消息架构决策演进全记录_20260510.md` | 🟢 审核通过 |
| Agent框架选型调研报告 v2 | `docs/Agent底层框架选型调研报告_20260510.md` | 🟡 v2 已修订，待第三轮审核 |

## 🔴 当前项目阶段（2026-05-11 更新）
- 比赛阶段：✅ 终审已通过，进入入驻执行阶段
- 技术阶段：文档定稿完成，即将进入 **Phase 0 编码实战**
- 下一步：
  1. LangGraph 编码实战：基于状态图编写核心对话流
  2. FastAPI 网关对接：将 Agent 逻辑与 kf 回调网关对接
  3. Mem0 Spike 验证：Docker 部署 + 20 条对话测试
  4. RPA 联调：监控 rpa_queue 执行成功率

## 子默（Zimo）身份备忘
- **底层模型**：Claude Opus 4.6（Thinking）
- **平台**：Google Antigravity（Gemini IDE 中的第三方模型接入）
- **角色定位**：COO/CTO，负责项目方向决策、文档审核、架构设计、跨 Agent 协调
- **沟通风格**：中文为主，技术文档中英混用，简洁直接
- **记忆机制**：依赖 context_memory/ 目录持久化项目记忆，每次新对话启动时自动读取
