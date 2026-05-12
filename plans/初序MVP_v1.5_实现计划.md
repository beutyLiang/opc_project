# 初序健康客服智能体 MVP (v1.5) 实现计划

## 1. 目标 (Goal)
基于 v1.5 技术栈决策，实现一个最小可行性产品（MVP）。MVP 需跑通从“微信小程序”到“FastAPI后端”，再到“LangGraph/DeepSeek大模型”的完整闭环，实现支持长周期记忆与复杂意图打断的数字医疗管家对话流。

## 2. 核心设计思路 (Design Thinking)

### 2.1 架构分层
本 MVP 严格遵循 `Hub & Spoke` 解耦模式与 `LangGraph + LangChain组件` 的混合编排：
*   **前端展示层 (Mini Program)**：采用 `uni-app (Vue3 + Vite)` 开发。主打适老化极简设计（大字号、少按钮、语音输入优先）。
*   **网关调度层 (FastAPI)**：双轨路由引擎。
    *   `REST API`: `/api/v1/chat` (面向小程序，接收与返回结构化 JSON)
    *   `Webhook`: `/api/v1/wechat/callback` (面向企业微信客服，接收 XML 事件，用于降级推送)
*   **AI 编排核心 (LangGraph)**：使用 `StateGraph` 维护问诊的长期会话状态。
*   **AI 组件底座 (LangChain)**：使用 `ChatOpenAI` 挂载 `DeepSeek V4 Flash`；使用 `@tool` 定义工具。

### 2.2 LangGraph 状态机设计 (State Machine)
*   **State 定义**：
    ```python
    class AgentState(TypedDict):
        messages: Annotated[Sequence[BaseMessage], operator.add]
        user_id: str
        diagnosis_stage: str # 枚举: greeting, symptom_collection, recommendation
    ```
*   **流转逻辑**：AI 根据当前收集的症状完整度，自主决定是在 `symptom_collection` 节点继续追问，还是流转到 `recommendation` 节点出具体检方案。
*   **记忆持久化**：MVP 阶段使用 LangGraph 官方的 `MemorySaver` (基于 PostgreSQL) 实现 `thread_id` 级别的多轮对话记忆（为后续剥离接入 Mem0 或外部图数据库留出接口）。

## 3. 具体变更与任务拆解 (Proposed Changes)

### Phase 0.1: 基础设施搭建
*   [NEW] `opc_project/backend/main.py`: 初始化 FastAPI 应用与路由骨架。
*   [NEW] `opc_project/backend/agent/graph.py`: 编写 LangGraph 核心流转节点。
*   [NEW] `opc_project/backend/agent/llm.py`: 封装基于 DeepSeek V4 的 LangChain `ChatModel`。

### Phase 0.2: 前端小程序基建
*   [NEW] `opc_project/frontend_mini/`: 初始化 uni-app 工程。
*   [NEW] 极简聊天界面组件，支持文本流式渲染，对接 FastAPI `POST /api/v1/chat` 接口。

## 4. 验证方案 (Verification Plan)

### 验证点 1：LangGraph 非线性控制
*   模拟用户在回答症状时突然跑题：“对了，你们这的体检套餐贵吗？”
*   **预期**：Agent 能够回答价格问题后，自动将状态机拉回 `symptom_collection` 节点继续追问症状。

### 验证点 2：适老化前端 JSON 解析
*   验证前端是否能正确解析后端下发的包含 `action: render_product_card` 的 JSON 数据，并在聊天流中渲染出服务卡片。

---

> [!IMPORTANT]
> **需要人工/子默确认的事项**
> 1. DeepSeek API Key 环境变量是否已在测试服务器就绪？
> 2. 小程序测试号的 AppID 是否已申请（用于开发时跑真机预览）？
