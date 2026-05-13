# 初序健康 AI - 知识库与高命中率 RAG 架构方案

## 1. 核心目标与痛点
针对大量医疗 QA 和知识指南的导入，传统单纯依赖大模型自身的记忆极易出现“幻觉”，且直接通过向量距离检索（Dense Retrieval）往往无法精确匹配专有名词。我们需要构建一套**高精度混合检索架构（RAG）**。

## 2. 三步走提升知识库命中率 (High Hit-Rate RAG)

### 第一步：精准的数据清洗与切分 (Intelligent Chunking)
- **QA 问答对提取**：将现有 Excel/TXT 中的 QA 数据独立抽取。以 `Question` 的语义向量作为召回索引，以 `Answer` 作为返回负载（Payload）。
- **长文本语义分块**：对于长篇医疗指南，采用基于段落或基于标题的上下文感知分块（Context-aware Chunking），并在入库前使用 LLM 摘要技术为每个 Chunk 生成元信息（Metadata），增强可检索性。

### 第二步：混合检索 + 重排引擎 (Hybrid Search + Reranker)
这是保证医疗检索准确率的“杀招”，分为三路并发：
1. **向量检索（Dense）**：使用 `BGE-m3` 或 OpenAI 兼容的高效 Embedding 模型，负责“懂语义”（如匹配“拉肚子”与“腹泻”）。
2. **稀疏检索（Sparse/BM25）**：基于关键词库，负责“抠字眼”，确保特定药名、特定体检项目的精准定位，弥补向量检索在专有名词上的劣势。
3. **模型重排（Reranker）**：将前两路检索召回的 Top 20 候选片段，送入专门的重排模型（如 `BGE-Reranker`）进行二次打分，截取真正高相关的 Top 3 送入 DeepSeek 大脑。

### 第三步：无缝集成 LangGraph 状态机 (Tool Calling)
不破坏现有的多轮对话逻辑，通过 Tool 的形式集成：
1. **轻量级基座**：初期验证可采用本地免部署的 `ChromaDB` 或 `FAISS`，后期平滑迁移至生产级 `Milvus` 或 `Qdrant`。
2. **智能触发**：在 `graph.py` 的 AgentState 中，注册 `search_knowledge_base` 工具。当 DeepSeek 识别出用户正在询问具体疾病或平台规则时，主动调用该 Tool 获取背景知识，再结合用户的对话上下文给出极具同理心的回答。

## 3. 落地推进计划建议
1. 提供一批脱敏的 QA 数据样例。
2. 搭建本地 ChromaDB 环境，跑通“向量化入库 -> 本地查询”最小闭环。
3. 封装为 FastAPI 后端工具，在现有的微信小程序中实测检索准确度。
