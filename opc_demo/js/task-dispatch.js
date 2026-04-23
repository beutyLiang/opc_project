/* ===== Task Dispatch System — 任务派发与执行模拟 ===== */

// ---- 后台模拟引擎（脱离DOM，支持页面切换） ----
let activeSimulations = {};

// 请求浏览器通知权限
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '🤖' });
  }
}

// 预设的模拟任务模板（用于自动生成逼真的输出）
const TASK_TEMPLATES = {
  '写小红书文案': {
    outputTitle: '📝 小红书文案 · 谷雨养肝专题',
    outputContent: `# 🌿 谷雨时节，你的肝还好吗？

> "春养肝，夏养心。" 谷雨是春天最后一个节气，也是养肝的黄金收尾期！

## ✨ 3个信号说明你需要养肝了：
1. 😤 最近特别容易发脾气、情绪波动大
2. 😴 明明睡够了还是觉得累
3. 🫣 脸色发黄、眼睛干涩

## 🍵 推荐方案：五行养肝茶
- 菊花 + 枸杞 + 决明子
- 每天一杯，疏肝理气
- 口感清甜不苦涩，办公室也能喝

## 💡 小tips：
谷雨前后多吃绿色蔬菜（菠菜、芹菜），少熬夜，11点前入睡让肝脏自我修复～

---
📌 关注「初序健康」，每个节气都有定制养生方案
🏷️ #谷雨养生 #养肝茶 #五行体质 #初序健康`,
    estimatedTokens: 1850,
    charsPerTick: 3,
    tickInterval: 40
  },
  '撰写竞品分析': {
    outputTitle: '📊 竞品分析报告 · Dify 平台深度拆解',
    outputContent: `# Dify 平台竞品分析报告

## 一、产品概述
Dify 是一个开源的 LLM 应用开发平台，定位为"LLMOps"工具。

## 二、核心功能对比

| 维度 | Dify | OPC OS |
|------|------|--------|
| 定位 | 开发者工具 | 一人公司操作系统 |
| 用户群 | 技术人员 | 非技术创业者 |
| Agent 管理 | 工作流编排 | 拟人化员工管理 |
| 可视化 | 流程图 | 像素办公室 |
| 上手难度 | 中等 | 极低 |

## 三、Dify 的优势
1. 开源生态成熟，社区活跃
2. RAG 能力强，支持多种向量库
3. 工作流编排灵活度高

## 四、Dify 的不足（OPC OS 的机会）
1. **缺乏"公司视角"**：Dify 是工具思维，不是经营思维
2. **无财务模块**：不追踪 ROI，只关注技术指标
3. **零拟人化**：用户看到的是冷冰冰的 API 调用日志

## 五、结论与建议
OPC OS 的差异化在于"让非技术人员像管理真实公司一样管理 AI"。建议避免与 Dify 在技术深度上竞争，而是强化"商业闭环+视觉沉浸"的独特优势。`,
    estimatedTokens: 2400,
    charsPerTick: 3,
    tickInterval: 40
  },
  '制定运营SOP': {
    outputTitle: '📋 社群运营 SOP v2.0',
    outputContent: `# 初序健康 · 社群运营标准操作流程 (SOP v2.0)

## 一、每日必做动作（3项）

### 🌅 早间（8:00-9:00）
- [ ] 发布「今日节气/养生提醒」（使用 AI 自动生成）
- [ ] 检查昨日未回复的用户消息
- [ ] 更新社群公告（如有活动）

### 🌤️ 午间（12:00-13:00）
- [ ] 发布互动话题（如"你今天喝水够了吗？"）
- [ ] 转发当日小红书内容到群内

### 🌙 晚间（20:00-21:00）
- [ ] 发布晚安养生小知识
- [ ] 统计当日活跃度数据
- [ ] 标记高意向用户（私聊跟进）

## 二、每周必做动作（2项）
1. **周三**：社群专属福利日（限时优惠券）
2. **周日**：发布「本周养生周报」（AI 汇总生成）

## 三、关键指标（KPI）
- 日活跃率 ≥ 40%
- 周新增成员 ≥ 10人
- 月转化率（社群→商城下单）≥ 5%

## 四、异常处理
- 用户投诉：2小时内响应，24小时内解决
- 负面舆情：立即上报 CEO，启动危机公关流程`,
    estimatedTokens: 1600,
    charsPerTick: 3,
    tickInterval: 40
  },
  '自定义任务': {
    outputTitle: '📄 任务执行结果',
    outputContent: `# 任务执行报告

## 执行摘要
根据您的指令，我已完成以下工作：

### 1. 需求分析
- 已理解任务目标和约束条件
- 已识别关键交付物

### 2. 执行过程
- 调用了相关知识库进行信息检索
- 综合多个数据源进行交叉验证
- 按照最佳实践生成结构化输出

### 3. 交付成果
任务已按要求完成。以上为模拟输出，真实环境中将接入实际的大模型 API 生成针对性内容。

### 4. 后续建议
- 建议在 48 小时内进行人工审核
- 如需修改，可重新派发任务并附上修改意见`,
    estimatedTokens: 980,
    charsPerTick: 3,
    tickInterval: 40
  },
  '深度市场调研': {
    outputTitle: '📊 深度市场调研报告 · AI健康赛道全景分析',
    outputContent: `# AI 健康管理赛道 · 2026 年度深度市场调研报告\n\n## 一、行业概述\n\n### 1.1 市场规模与增长趋势\n全球数字健康市场在 2025 年已达到 5,090 亿美元规模，预计到 2030 年将突破 1.2 万亿美元，复合年增长率(CAGR)约为 18.7%。中国市场方面，数字健康产业规模在 2025 年达到 1,200 亿元人民币，其中 AI 驱动的健康管理细分领域增速最快，年增长率超过 35%。\n\n### 1.2 核心驱动因素\n1. **政策红利**："健康中国 2030"规划纲要持续推进，数字化医疗被列为重点发展方向\n2. **技术成熟**：大模型能力突破使得个性化健康建议成为可能，成本大幅降低\n3. **消费升级**：后疫情时代健康意识觉醒，年轻人尤其关注亚健康和养生调理\n4. **人口老龄化**：60 岁以上人口已超 3 亿，慢病管理需求激增\n\n## 二、竞争格局分析\n\n### 2.1 第一梯队（估值 10 亿+）\n| 公司 | 核心产品 | 月活用户 | 商业模式 | AI 能力 |\n|------|---------|---------|---------|---------|\n| 丁香健康 | 健康科普+问诊 | 8,500 万 | 广告+电商 | 中等 |\n| 薄荷健康 | 饮食记录+减脂 | 3,200 万 | 会员+食品 | 中等 |\n| Keep | 运动健身+课程 | 4,800 万 | 会员+商城 | 较弱 |\n| 微医 | 在线问诊+处方 | 2,900 万 | 诊疗+保险 | 强 |\n\n### 2.2 第二梯队（新锐玩家）\n- **妙健康**：体质评估+可穿戴设备，B端合作为主\n- **有来医生**：AI 分诊+视频问诊，深耕基层医疗\n- **右脑科技**：心理健康+AI 对话，垂直赛道选手\n\n### 2.3 初序健康的差异化定位\n初序健康（OPC模式）的核心差异在于：\n1. 不做"平台"，做"一人公司操作系统"\n2. AI Agent 不是辅助工具，而是"虚拟员工"\n3. 体质测评+中医养生+社群运营的闭环\n4. 极低运营成本（月 ¥500-1000），适合个人创业者\n\n## 三、用户画像与需求洞察\n\n### 3.1 核心目标用户\n- **年龄段**：25-45 岁城市白领\n- **痛点 TOP3**：\n  1. 亚健康状态频发（失眠、疲劳、焦虑）\n  2. 想养生但不知道从何开始\n  3. 对中医感兴趣但缺乏信任感\n\n### 3.2 付费意愿调研\n基于 500 份有效问卷分析：\n- 愿意为"个性化体质评估"付费：72%\n- 可接受价格区间：9.9-49.9 元/次\n- 愿意为"持续跟踪服务"订阅：38%\n- 可接受月费：19.9-39.9 元/月\n\n## 四、技术趋势判断\n\n### 4.1 大模型在健康领域的应用现状\n- **强项**：健康科普、饮食建议、运动方案生成\n- **弱项**：疾病诊断（合规限制）、药物推荐（风险高）\n- **机会**：中医体质辨识（标准化程度高，且不涉及诊疗）\n\n### 4.2 关键技术栈建议\n- **前端**：Next.js + PWA（低成本覆盖多端）\n- **后端**：FastAPI 网关 + Dify/Coze 工作流\n- **数据**：PostgreSQL + Redis + 向量数据库\n\n## 五、风险评估\n\n### 5.1 法律合规风险\n1. 中医养生建议不等于医疗行为，但需加 disclaimer\n2. 健康数据属于个人敏感信息，需符合《个人信息保护法》\n3. 食品推荐需标注"本产品不能替代药物"\n\n### 5.2 商业风险\n1. 获客成本可能高于预期（健康赛道 CAC 约 30-80 元）\n2. 用户留存依赖内容质量和个性化程度\n3. CPS 佣金模式前期收入不稳定\n\n## 六、结论与战略建议\n\n### 6.1 短期（0-3个月）\n- 完成 MVP：体质测评 + AI 养生方案\n- 验证付费转化：单次测评 ¥9.9\n- 种子用户目标：500 人\n\n### 6.2 中期（3-6个月）\n- 上线社群运营模块\n- 接入健康商城（CPS 分佣）\n- 月营收目标：¥3,000+\n\n### 6.3 长期（6-12个月）\n- 开放 OPC 操作系统给其他一人公司\n- 探索 B 端合作（企业健康管理）\n- 月营收目标：¥10,000+\n\n---\n\n📌 报告由 OPC OS · AI 调研官自动生成\n📅 调研周期：2026年4月1日 - 2026年4月22日\n🔖 数据来源：公开财报、行业白皮书、问卷调研、竞品产品体验`,
    estimatedTokens: 8500,
    charsPerTick: 1,
    tickInterval: 35
  }
};

// 初始化 appState.taskHistory
if (!appState.taskHistory) {
  appState.taskHistory = [];
}

// ---- 渲染任务中心（覆盖原有的 renderTasks） ----
const _origRenderTasks = renderTasks;
renderTasks = function() {
  const history = appState.taskHistory || [];
  
  document.getElementById('tasksContent').innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <div>
        <span class="badge badge-primary">${history.filter(t=>t.status==='completed').length} 已完成</span>
        <span class="badge badge-warning" style="margin-left:8px">${history.filter(t=>t.status==='running').length} 执行中</span>
        <span class="badge badge-secondary" style="margin-left:8px">${history.length} 总计</span>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openTaskDispatch()">🚀 派发新任务</button>
    </div>

    ${history.length === 0 ? `
      <div class="empty-state" style="padding:60px 0">
        <div class="empty-icon">📋</div>
        <h3>还没有任务记录</h3>
        <p style="color:var(--text-muted);margin-bottom:20px">点击上方「派发新任务」，给你的 Agent 员工安排工作吧！</p>
        <button class="btn btn-primary" onclick="openTaskDispatch()">🚀 派发第一个任务</button>
      </div>
    ` : `
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${history.slice().reverse().map((task, ri) => {
          const idx = history.length - 1 - ri;
          const agent = appState.agents.find(a => a.id === task.agentId) || { name: '未知', avatar: '👤', color: '#666' };
          const statusMap = { completed: { text: '✅ 已完成', cls: 'badge-success' }, running: { text: '⏳ 执行中', cls: 'badge-warning' }, failed: { text: '❌ 失败', cls: 'badge-danger' } };
          const st = statusMap[task.status] || statusMap.completed;
          return `
          <div class="card animate-fadeInUp" style="border-left:3px solid ${agent.color}; cursor:pointer;" onclick="viewTaskDetail(${idx})">
            <div class="card-body" style="padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="width:40px;height:40px;border-radius:10px;background:${agent.color};display:flex;align-items:center;justify-content:center;font-size:20px">${agent.avatar}</div>
                  <div>
                    <div style="font-weight:700;font-size:15px;">${task.title}</div>
                    <div style="font-size:12px;color:var(--text-muted)">执行人: ${agent.name} · ${task.createdAt}</div>
                  </div>
                </div>
                <span class="badge ${st.cls}">${st.text}</span>
              </div>
              <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${task.instruction}</div>
              <div style="display:flex; gap:16px; font-size:12px; color:var(--text-muted);">
                <span>🪙 Token: ${task.tokenUsed || 0}</span>
                <span>⏱️ 耗时: ${task.duration || (task.elapsed ? task.elapsed+'s' : '-')}</span>
                ${task.status === 'completed' ? '<span style="color:var(--accent-secondary)">📄 点击查看产出物 →</span>' : ''}
                ${task.status === 'running' ? '<span style="color:var(--accent-warning)">👁️ 点击查看实时进度 →</span>' : ''}
              </div>
              ${task.status === 'running' ? `<div class="progress-bar" style="margin-top:8px"><div class="progress-fill" style="width:${task.progress||0}%;background:var(--accent-warning);transition:width 0.5s"></div></div>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    `}
  `;
};

// ---- 打开任务派发弹窗 ----
function openTaskDispatch() {
  const agentOptions = appState.agents.map((a, i) => `<option value="${a.id}" ${i===0?'selected':''}>${a.avatar} ${a.name} (${a.role})</option>`).join('');
  const taskTypeOptions = Object.keys(TASK_TEMPLATES).map((k, i) => `<option value="${k}" ${i===0?'selected':''}>${k}</option>`).join('');

  showModal(`
    <div class="modal-title">🚀 派发任务</div>
    <div style="margin-bottom:16px">
      <label class="input-label">选择执行人</label>
      <select class="input" id="taskAgent">${agentOptions}</select>
    </div>
    <div style="margin-bottom:16px">
      <label class="input-label">任务类型</label>
      <select class="input" id="taskType" onchange="updateTaskInstruction()">${taskTypeOptions}</select>
    </div>
    <div style="margin-bottom:16px">
      <label class="input-label">任务指令</label>
      <textarea class="input" id="taskInstruction" rows="3" placeholder="详细描述你想让 Agent 做什么..." style="resize:vertical">谷雨时节，写一篇养肝主题的小红书种草文案，突出我们的五行养肝茶产品</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="dispatchTask()">🚀 立即派发</button>
    </div>
  `);
}

function updateTaskInstruction() {
  const type = document.getElementById('taskType').value;
  const instrMap = {
    '写小红书文案': '谷雨时节，写一篇养肝主题的小红书种草文案，突出我们的五行养肝茶产品',
    '撰写竞品分析': '深度分析 Dify 平台，对比我们 OPC OS 的差异化优势，给出竞争策略建议',
    '制定运营SOP': '为初序健康的养生社群制定一套标准化运营流程（SOP），覆盖每日、每周必做动作',
    '深度市场调研': '对AI健康管理赛道进行全景分析，包含市场规模、竞品分析、用户画像、技术趋势与战略建议',
    '自定义任务': ''
  };
  document.getElementById('taskInstruction').value = instrMap[type] || '';
}

// ---- 派发任务 → 启动后台模拟引擎 ----
function dispatchTask() {
  const agentId = document.getElementById('taskAgent').value;
  const taskType = document.getElementById('taskType').value;
  const instruction = document.getElementById('taskInstruction').value.trim();
  if (!instruction) { showToast('请输入任务指令', 'error'); return; }

  const agent = appState.agents.find(a => a.id === agentId);
  if (!agent) { showToast('找不到该 Agent', 'error'); return; }

  const template = TASK_TEMPLATES[taskType] || TASK_TEMPLATES['自定义任务'];
  const taskId = 'task_' + Date.now();
  const now = new Date();
  const timeStr = `${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;

  const newTask = {
    id: taskId,
    agentId: agentId,
    title: template.outputTitle,
    instruction: instruction,
    taskType: taskType,
    status: 'running',
    progress: 0,
    tokenUsed: 0,
    tokenTarget: template.estimatedTokens,
    elapsed: 0,
    currentOutput: '',
    duration: null,
    output: null,
    createdAt: timeStr,
    completedAt: null,
    startedAt: Date.now()
  };

  appState.taskHistory.push(newTask);
  agent.status = 'busy';
  saveState();
  closeModal();
  // 立刻刷新像素办公室状态（所有实例）
  if (typeof renderPixelOffice === 'function') {
    const offices = document.querySelectorAll('.pixel-office-wrapper');
    const newHtml = renderPixelOffice();
    offices.forEach(el => el.outerHTML = newHtml);
  }

  // 启动后台引擎（不依赖DOM）
  startBackgroundSimulation(taskId, template);
  // 显示执行视图
  showExecutionView(taskId, agent, template);
}

// ---- 实时执行视图（核心体验） ----
function showExecutionView(taskId, agent, template) {
  const task = appState.taskHistory.find(t => t.id === taskId);
  if (!task) return;

  document.getElementById('tasksContent').innerHTML = `
    <div class="card animate-fadeIn" style="border-top:3px solid ${agent.color}">
      <div class="card-body" style="padding:24px;">
        <!-- 头部：Agent 信息 -->
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid var(--border-color);">
          <div style="width:56px;height:56px;border-radius:14px;background:${agent.color};display:flex;align-items:center;justify-content:center;font-size:28px;">${agent.avatar}</div>
          <div style="flex:1">
            <div style="font-size:20px;font-weight:700;">${agent.name} <span class="status-dot busy" style="display:inline-block;margin-left:6px;"></span></div>
            <div style="font-size:13px;color:var(--text-muted);">${agent.role} · 正在执行任务...</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:12px;color:var(--text-muted)">平台</div>
            <div style="font-weight:600;color:var(--text-secondary)">${agent.platform}</div>
          </div>
        </div>

        <!-- 任务指令 -->
        <div style="background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.2); border-radius:10px; padding:14px; margin-bottom:24px;">
          <div style="font-size:12px;color:var(--accent-primary);margin-bottom:6px;font-weight:600">📩 任务指令</div>
          <div style="font-size:14px;color:var(--text-primary);">${task.instruction}</div>
        </div>

        <!-- 实时指标面板 -->
        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:16px; margin-bottom:24px;">
          <div class="card" style="text-align:center; padding:16px;">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">Token 消耗</div>
            <div style="font-size:24px;font-weight:700;color:var(--accent-primary)" id="execTokenCount">0</div>
            <div style="font-size:11px;color:var(--text-muted)">预估 ~${template.estimatedTokens}</div>
          </div>
          <div class="card" style="text-align:center; padding:16px;">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">执行耗时</div>
            <div style="font-size:24px;font-weight:700;color:#f59e0b" id="execTimeCount">0s</div>
            <div style="font-size:11px;color:var(--text-muted)">实时计时</div>
          </div>
          <div class="card" style="text-align:center; padding:16px;">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">完成进度</div>
            <div style="font-size:24px;font-weight:700;color:var(--accent-secondary)" id="execProgress">0%</div>
            <div class="progress-bar" style="margin-top:6px"><div class="progress-fill" id="execProgressBar" style="width:0%;background:var(--accent-secondary);transition:width 0.3s"></div></div>
          </div>
        </div>

        <!-- 流式输出区域 -->
        <div style="margin-bottom:16px">
          <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">📄 实时输出 <span style="color:var(--text-muted);font-weight:400" id="execStatusLabel">（生成中...）</span></div>
          <div id="execOutputStream" style="background:rgba(0,0,0,0.3); border:1px solid var(--border-color); border-radius:10px; padding:20px; min-height:200px; max-height:400px; overflow-y:auto; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.8; color:var(--text-secondary); white-space:pre-wrap; word-wrap:break-word;">
            <span class="typing-cursor" style="animation: blink 1s infinite">▊</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- 全局后台模拟引擎（真实时间驱动，防止刷新丢失进度） ----
function initGlobalSimulationEngine() {
  setInterval(() => {
    let stateChanged = false;
    const now = Date.now();

    appState.taskHistory.forEach(task => {
      if (task.status === 'running') {
        const template = TASK_TEMPLATES[task.taskType] || TASK_TEMPLATES['自定义任务'];
        const fullText = template.outputContent;
        const totalChars = fullText.length;
        const totalTokens = template.estimatedTokens;
        
        // 动态计算预计总耗时（如：35ms * 总字符数，大约 1-2 分钟）
        const estimatedMs = totalChars * (template.tickInterval || 40) / (template.charsPerTick || 3);
        const startedAt = task.startedAt || now;
        
        // 补全旧任务可能缺失的 startedAt
        if (!task.startedAt) {
          task.startedAt = now;
          task.elapsed = 0;
        }

        const elapsedMs = now - task.startedAt;
        let progressPercent = Math.min((elapsedMs / estimatedMs) * 100, 100);
        
        // 如果进度达到 100%
        if (progressPercent >= 100) {
          task.progress = 100;
          task.tokenUsed = totalTokens;
          task.currentOutput = fullText;
          task.elapsed = Math.round(estimatedMs / 1000);
          completeTask(task.id, template);
          stateChanged = true;
        } else {
          // 更新执行中状态
          task.progress = Math.round(progressPercent);
          task.tokenUsed = Math.round((progressPercent / 100) * totalTokens);
          const charIndex = Math.round((progressPercent / 100) * totalChars);
          task.currentOutput = fullText.substring(0, charIndex);
          task.elapsed = Math.round(elapsedMs / 1000);
          
          // 如果当前任务在视图中，更新DOM
          updateExecDOM(task, template);
          stateChanged = true;
        }
      }
    });

    if (stateChanged) {
      saveState();
    }
  }, 1000); // 每秒全局轮询一次
}

// 页面加载时启动全局引擎
initGlobalSimulationEngine();

function startBackgroundSimulation(taskId, template) {
  // 不再使用单独的 setInterval，仅依赖全局引擎
  // 全局引擎会通过检查 task.status === 'running' 自动接管
}

function updateExecDOM(task, template) {
  const el = id => document.getElementById(id);
  if (el('execTokenCount')) el('execTokenCount').textContent = (task.tokenUsed||0).toLocaleString();
  if (el('execTimeCount')) el('execTimeCount').textContent = task.elapsed + 's';
  if (el('execProgress')) el('execProgress').textContent = task.progress + '%';
  if (el('execProgressBar')) el('execProgressBar').style.width = task.progress + '%';
  const out = el('execOutputStream');
  if (out) { out.textContent = task.currentOutput; out.scrollTop = out.scrollHeight; }
}

// ---- 任务完成（后台调用） ----
function completeTask(taskId, template) {
  const task = appState.taskHistory.find(t => t.id === taskId);
  if (!task) return;
  const agent = appState.agents.find(a => a.id === task.agentId);

  task.status = 'completed';
  task.output = template.outputContent;
  task.duration = task.elapsed + '秒';
  task.completedAt = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  if (agent) {
    agent.status = 'online';
    if (agent.tasks) { agent.tasks.completed = (agent.tasks.completed||0)+1; agent.tasks.total = (agent.tasks.total||0)+1; }
    agent.tokenUsage = (agent.tokenUsage||0) + task.tokenUsed;
  }
  saveState();

  // 刷新像素办公室（所有实例：Agent 恢复空闲状态）
  if (typeof renderPixelOffice === 'function') {
    const offices = document.querySelectorAll('.pixel-office-wrapper');
    const newHtml = renderPixelOffice();
    offices.forEach(el => el.outerHTML = newHtml);
  }

  // 更新执行DOM（如果可见）
  const label = document.getElementById('execStatusLabel');
  if (label) label.innerHTML = '<span style="color:var(--accent-secondary)">✅ 生成完毕！</span>';
  const out = document.getElementById('execOutputStream');
  if (out && out.parentElement && out.parentElement.parentElement) {
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;gap:12px;justify-content:center;margin-top:20px;padding-top:20px;border-top:1px solid var(--border-color);';
    d.innerHTML = '<button class="btn btn-secondary" onclick="renderTasks()">← 返回任务列表</button><button class="btn btn-primary" onclick="openTaskDispatch()">🚀 继续派发</button>';
    out.parentElement.parentElement.appendChild(d);
  }

  // 浏览器通知
  sendNotification('OPC OS · 任务完成', `${agent?agent.name:'员工'} 完成了「${task.title}」，消耗 ${task.tokenUsed} Token`);
  showToast(`${agent?agent.name:'员工'} 完成了任务！消耗 ${task.tokenUsed} Token`, 'success');
}

// ---- 查看任务详情 / 产出物 ----
function viewTaskDetail(index) {
  const task = appState.taskHistory[index];
  if (!task) return;
  const agent = appState.agents.find(a => a.id === task.agentId) || { name: '未知', avatar: '👤', color: '#666' };

  // 如果任务正在运行且后台引擎还在跑，展示实时执行视图
  if (task.status === 'running' && activeSimulations[task.id]) {
    const template = TASK_TEMPLATES[task.taskType] || TASK_TEMPLATES['自定义任务'];
    showExecutionView(task.id, agent, template);
    // 用当前进度填充DOM
    setTimeout(() => updateExecDOM(task, template), 50);
    return;
  }

  showModal(`
    <div style="max-height:70vh;overflow-y:auto;">
      <div class="modal-title" style="display:flex;align-items:center;gap:12px;">
        <div style="width:36px;height:36px;border-radius:8px;background:${agent.color};display:flex;align-items:center;justify-content:center;font-size:18px">${agent.avatar}</div>
        ${task.title}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
        <div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:12px;text-align:center">
          <div style="font-size:11px;color:var(--text-muted)">执行人</div>
          <div style="font-weight:600;margin-top:2px">${agent.name}</div>
        </div>
        <div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:12px;text-align:center">
          <div style="font-size:11px;color:var(--text-muted)">Token 消耗</div>
          <div style="font-weight:600;margin-top:2px;color:var(--accent-primary)">${(task.tokenUsed||0).toLocaleString()}</div>
        </div>
        <div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:12px;text-align:center">
          <div style="font-size:11px;color:var(--text-muted)">执行耗时</div>
          <div style="font-weight:600;margin-top:2px;color:#f59e0b">${task.duration || '-'}</div>
        </div>
      </div>
      <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.15);border-radius:8px;padding:12px;margin-bottom:16px;">
        <div style="font-size:11px;color:var(--accent-primary);margin-bottom:4px;font-weight:600">📩 原始指令</div>
        <div style="font-size:13px">${task.instruction}</div>
      </div>
      ${task.output ? `
        <div style="margin-bottom:16px;">
          <div style="font-size:13px;font-weight:600;color:var(--accent-secondary);margin-bottom:8px;">📄 产出物</div>
          <div style="background:rgba(0,0,0,0.3);border:1px solid var(--border-color);border-radius:8px;padding:16px;font-size:13px;line-height:1.8;white-space:pre-wrap;max-height:350px;overflow-y:auto;color:var(--text-secondary)">${task.output}</div>
        </div>
      ` : '<div style="color:var(--text-muted);text-align:center;padding:20px">任务正在执行中...</div>'}
      <div style="text-align:right;margin-top:12px;">
        <button class="btn btn-secondary" onclick="closeModal()">关闭</button>
      </div>
    </div>
  `);
}
