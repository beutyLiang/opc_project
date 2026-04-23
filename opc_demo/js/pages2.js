// OPC OS — Page Renderers Part 2 (Health, Mall, Community, Finance)

// Coze SDK 状态管理
let cozeClientInstance = null;

// 动态检测 SDK 是否可用（每次调用时重新检查，解决 CDN 加载时序问题）
function isCozeSDKReady() {
  return typeof CozeWebSDK !== 'undefined';
}

function renderHealth() {
  const sdkReady = isCozeSDKReady();
  document.getElementById('healthContent').innerHTML = `
    <div class="grid-2">
      <div class="card animate-fadeInUp stagger-1" style="grid-row:span 2">
        <div class="card-header">
          <span class="card-title">💬 AI 健康管家对话</span>
          <span class="badge ${sdkReady ? 'badge-success' : 'badge-warning'}" style="font-size:11px" id="cozeStatusBadge">${sdkReady ? '🟢 AI 已连接' : '⚡ 演示模式'}</span>
        </div>
        <div class="card-body" style="padding:0">
          <div class="chat-container" id="chatContainer" style="position:relative">
            <div class="chat-message bot">
              <div class="chat-avatar">💚</div>
              <div class="chat-bubble">你好！我是初序AI健康管家。${sdkReady ? '我已接入 Coze AI 引擎，可以为你提供真实的体质评估和养生建议。' : '我可以帮你做一个3分钟体质评估，了解你的身体状况并给出个性化的养生建议。'}准备好了吗？</div>
            </div>
          </div>
          <div class="chat-input-area">
            <input type="text" class="input chat-input" id="chatInput" placeholder="${sdkReady ? '向 AI 健康管家提问...' : '输入你的问题...'}" onkeypress="if(event.key==='Enter')sendChat()">
            <button class="btn btn-primary" onclick="sendChat()">发送</button>
          </div>
        </div>
      </div>
      <div class="card animate-fadeInUp stagger-2">
        <div class="card-header"><span class="card-title">🎯 快速测评入口</span></div>
        <div class="card-body">
          <div class="quick-actions">
            <button class="quick-action-btn" onclick="startAssessment()">
              <span>🔍</span><span>开始体质测评</span>
            </button>
            <button class="quick-action-btn" onclick="sendQuickChat('根据谷雨节气，推荐适合今天的饮食')">
              <span>🍽️</span><span>今天吃什么</span>
            </button>
            <button class="quick-action-btn" onclick="sendQuickChat('谷雨节气有什么养生建议？')">
              <span>🌿</span><span>节气养生</span>
            </button>
            <button class="quick-action-btn" onclick="showToast('查看你的健康画像','info')">
              <span>📋</span><span>我的画像</span>
            </button>
          </div>
        </div>
      </div>
      <div class="card animate-fadeInUp stagger-3">
        <div class="card-header"><span class="card-title">📊 用户测评统计</span></div>
        <div class="card-body">
          <div class="body-type-stats">${MOCK.bodyTypes.map(b => `
            <div class="body-type-row">
              <span class="body-type-icon">${b.element}</span>
              <span class="body-type-name" style="color:${b.color}">${b.type}</span>
              <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${Math.random()*60+20}%;background:${b.color}"></div></div>
              <span class="body-type-count">${Math.floor(Math.random()*80+20)}</span>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;

  // 初始化 Coze SDK 嵌入式对话（如果可用且尚未初始化）
  initCozeSDK();
}

// 初始化 Coze Web SDK
function initCozeSDK() {
  if (!isCozeSDKReady()) {
    console.warn('[OPC OS] Coze SDK 尚未加载，使用演示模式');
    return;
  }
  if (cozeClientInstance) return; // 已初始化

  try {
    // 从 coze-config.js 读取凭证（如果存在），否则使用默认值
    var cfg = window.COZE_CONFIG || {};
    var botId = cfg.bot_id || '7623660479886098451';
    var pat = cfg.token || 'pat_y75NvPU8EblcaJe40PqMuVA3ZT2Rka45M8qUycoiinNr1fNMlxBPl2FuJzCjArOF';

    cozeClientInstance = new CozeWebSDK.WebChatClient({
      config: { bot_id: botId },
      componentProps: { title: '初序 · AI 健康管家' },
      auth: {
        type: 'token',
        token: pat,
        onRefreshToken: function() { return pat; }
      }
    });
    console.log('[OPC OS] Coze Web SDK initialized — 右下角气泡可打开完整对话');

    // 更新状态徽章
    const badge = document.getElementById('cozeStatusBadge');
    if (badge) { badge.textContent = '🟢 AI 已连接'; badge.className = 'badge badge-success'; badge.style.fontSize = '11px'; }
  } catch (err) {
    console.warn('[OPC OS] Coze SDK init failed, using fallback:', err.message);
    const badge = document.getElementById('cozeStatusBadge');
    if (badge) { badge.textContent = '⚡ 演示模式'; badge.className = 'badge badge-warning'; badge.style.fontSize = '11px'; }
  }
}

// Fallback chat replies (用于无网络/SDK不可用时)
const chatReplies = [
  '好的，让我先了解一下你的基本情况。请问你的年龄段是？\nA. 18-25岁  B. 26-35岁  C. 36-45岁  D. 46岁以上',
  '谢谢！那你平时的睡眠质量如何？\nA. 入睡快、睡眠深  B. 偶尔失眠  C. 经常失眠或多梦  D. 严重睡眠障碍',
  '了解了。根据你的描述，初步判断你可能偏向**木型体质**，肝气偏旺，春季尤其需要注意疏肝理气。\n\n🍵 推荐方案：\n• 饮品：菊花枸杞茶（商城有售）\n• 饮食：多吃绿色蔬菜、少吃辛辣\n• 情绪：注意情绪管理，避免暴怒\n• 运动：散步、太极、八段锦\n\n需要我生成完整的个性化养生报告吗？',
  '好的！你的**个性化养生报告**已生成，包含饮食、作息、运动、情绪四维调养方案。你可以在"我的画像"中随时查看。\n\n另外，根据你的木型体质，商城里的「五行养肝茶·春季限定」非常适合你，要去看看吗？😊'
];
let chatIndex = 0;

function sendChat() {
  const input = document.getElementById('chatInput');
  const container = document.getElementById('chatContainer');
  const text = input.value.trim();
  if (!text) return;
  container.innerHTML += `<div class="chat-message user"><div class="chat-bubble user-bubble">${text}</div></div>`;
  input.value = '';
  container.scrollTop = container.scrollHeight;

  if (isCozeSDKReady() && cozeClientInstance) {
    // 提示用户使用右下角 SDK 气泡获取真实 AI 回复
    container.innerHTML += `<div class="chat-message bot animate-fadeIn"><div class="chat-avatar">💚</div><div class="chat-bubble">💡 点击右下角的 <strong>聊天气泡</strong> 可以打开完整的 AI 对话窗口，获得真实的体质测评和养生建议！<br><br>（右下角气泡已接入 Coze AI 引擎，支持多轮深度对话）</div></div>`;
    container.scrollTop = container.scrollHeight;
  } else {
    // Fallback: 预设回复
    container.innerHTML += `<div class="chat-message bot" id="typing"><div class="chat-avatar">💚</div><div class="chat-bubble typing-indicator"><span></span><span></span><span></span></div></div>`;
    container.scrollTop = container.scrollHeight;
    setTimeout(() => {
      const typing = document.getElementById('typing');
      if (typing) typing.remove();
      const reply = chatReplies[chatIndex % chatReplies.length];
      container.innerHTML += `<div class="chat-message bot animate-fadeIn"><div class="chat-avatar">💚</div><div class="chat-bubble">${reply.replace(/\\n/g,'<br>')}</div></div>`;
      container.scrollTop = container.scrollHeight;
      chatIndex++;
    }, 1200);
  }
}

function sendQuickChat(question) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = question; sendChat(); }
}

function startAssessment() {
  const container = document.getElementById('chatContainer');
  if (isCozeSDKReady() && cozeClientInstance) {
    container.innerHTML += `<div class="chat-message bot animate-fadeIn"><div class="chat-avatar">💚</div><div class="chat-bubble">🔍 体质测评已启动！<br><br>请点击右下角的 <strong>聊天气泡</strong>，在 AI 对话窗口中输入 <strong>"开始体质测评"</strong>，即可进入完整的 5 道题测评流程。<br><br>⏱️ 全程约 3 分钟，完成后将生成你的专属体质分析报告。</div></div>`;
  } else {
    container.innerHTML += `<div class="chat-message bot animate-fadeIn"><div class="chat-avatar">💚</div><div class="chat-bubble">好的，开始3分钟体质测评！<br><br>请问你的年龄段是？<br>A. 18-25岁  B. 26-35岁  C. 36-45岁  D. 46岁以上</div></div>`;
  }
  container.scrollTop = container.scrollHeight;
  showToast('体质测评已开始', 'info');
}

function renderMall() {
  document.getElementById('mallContent').innerHTML = `
    <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm filter-btn active" onclick="filterProducts(this,'all')">全部</button>
      <button class="btn btn-secondary btn-sm filter-btn" onclick="filterProducts(this,'节气推荐')">🌿 节气推荐</button>
      <button class="btn btn-secondary btn-sm filter-btn" onclick="filterProducts(this,'热销')">🔥 热销</button>
      <button class="btn btn-secondary btn-sm filter-btn" onclick="filterProducts(this,'新品')">✨ 新品</button>
    </div>
    <div class="product-grid">${MOCK.products.map((p, i) => `
      <div class="product-card animate-fadeInUp stagger-${i+1}" data-tag="${p.tag}">
        <div class="product-image">${p.image}</div>
        <div class="product-tag">${p.tag}</div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="product-body-type"><span class="badge badge-primary">${p.bodyType}</span></div>
          <div class="product-pricing">
            <span class="product-price">¥${p.price}</span>
            <span class="product-original">¥${p.originalPrice}</span>
          </div>
          <div class="product-stats">
            <span>已售 ${p.sales}</span>
            <span>佣金 ¥${p.commission}</span>
          </div>
          <button class="btn btn-primary btn-sm" style="width:100%;margin-top:12px" onclick="showToast('已生成CPS推广链接','success')">生成推广链接</button>
        </div>
      </div>`).join('')}
    </div>`;
}

function filterProducts(btn, tag) {
  document.querySelectorAll('.filter-btn').forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-secondary'); });
  btn.classList.remove('btn-secondary'); btn.classList.add('btn-primary');
  document.querySelectorAll('.product-card').forEach(card => {
    if (tag === 'all' || card.dataset.tag.includes(tag)) { card.style.display = ''; }
    else { card.style.display = 'none'; }
  });
}

function renderCommunity() {
  const total = MOCK.communities.reduce((s,c) => s + c.members, 0);
  const active = MOCK.communities.reduce((s,c) => s + c.active, 0);
  document.getElementById('communityContent').innerHTML = `
    <div class="stat-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card animate-fadeInUp stagger-1">
        <div class="stat-icon" style="background:rgba(99,102,241,0.15);color:#6366f1">👥</div>
        <div class="stat-value">${total}</div>
        <div class="stat-label">社群总人数</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-2">
        <div class="stat-icon" style="background:rgba(6,214,160,0.15);color:#06d6a0">💬</div>
        <div class="stat-value">${active}</div>
        <div class="stat-label">活跃成员</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-3">
        <div class="stat-icon" style="background:rgba(245,158,11,0.15);color:#f59e0b">📊</div>
        <div class="stat-value">${(active/total*100).toFixed(0)}%</div>
        <div class="stat-label">活跃率</div>
      </div>
    </div>
    <div class="card animate-fadeInUp stagger-4">
      <div class="card-header"><span class="card-title">社群列表</span><button class="btn btn-primary btn-sm" onclick="showToast('新社群创建成功！','success')">+ 创建社群</button></div>
      <div class="card-body"><div class="table-container"><table class="data-table">
        <thead><tr><th>社群名称</th><th>类型</th><th>成员</th><th>活跃</th><th>活跃率</th><th>创建日期</th></tr></thead>
        <tbody>${MOCK.communities.map(c => `<tr>
          <td style="font-weight:600">${c.name}</td>
          <td><span class="badge badge-primary">${c.type}</span></td>
          <td>${c.members}</td><td>${c.active}</td>
          <td><span class="badge ${(c.active/c.members)>0.6?'badge-success':'badge-warning'}">${(c.active/c.members*100).toFixed(0)}%</span></td>
          <td style="color:var(--text-muted)">${c.created}</td>
        </tr>`).join('')}</tbody>
      </table></div></div>
    </div>`;
}

function renderFinance() {
  const totalCost = MOCK.finance.tokenUsage.reduce((s,t) => s+t.cost, 0) + MOCK.finance.infrastructure.reduce((s,i) => s+i.cost, 0);
  document.getElementById('financeContent').innerHTML = `
    <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card animate-fadeInUp stagger-1">
        <div class="stat-icon" style="background:rgba(6,214,160,0.15);color:#06d6a0">💰</div>
        <div class="stat-value">¥${MOCK.stats.monthlyRevenue.toLocaleString()}</div>
        <div class="stat-label">本月营收</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-2">
        <div class="stat-icon" style="background:rgba(239,68,68,0.15);color:#ef4444">📉</div>
        <div class="stat-value">¥${totalCost}</div>
        <div class="stat-label">本月成本</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-3">
        <div class="stat-icon" style="background:rgba(99,102,241,0.15);color:#6366f1">📊</div>
        <div class="stat-value">¥${(MOCK.stats.monthlyRevenue - totalCost).toLocaleString()}</div>
        <div class="stat-label">净利润</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-4">
        <div class="stat-icon" style="background:rgba(245,158,11,0.15);color:#f59e0b">📈</div>
        <div class="stat-value">${((MOCK.stats.monthlyRevenue - totalCost)/MOCK.stats.monthlyRevenue*100).toFixed(0)}%</div>
        <div class="stat-label">利润率</div>
      </div>
    </div>
    <div class="grid-2" style="margin-bottom:24px">
      <div class="card animate-fadeInUp stagger-3">
        <div class="card-header"><span class="card-title">🤖 Token 消耗明细</span></div>
        <div class="card-body"><div class="table-container"><table class="data-table">
          <thead><tr><th>Agent</th><th>平台</th><th>用量</th><th>预算</th><th>费用</th><th>使用率</th></tr></thead>
          <tbody>${MOCK.finance.tokenUsage.map(t => `<tr>
            <td style="font-weight:600">${t.agent}</td><td>${t.platform}</td>
            <td>${formatNumber(t.used)}</td><td>${formatNumber(t.budget)}</td>
            <td>¥${t.cost}</td>
            <td><div class="progress-bar" style="width:80px;display:inline-block;vertical-align:middle"><div class="progress-fill" style="width:${(t.used/t.budget*100).toFixed(0)}%"></div></div> ${(t.used/t.budget*100).toFixed(0)}%</td>
          </tr>`).join('')}</tbody>
        </table></div></div>
      </div>
      <div class="card animate-fadeInUp stagger-4">
        <div class="card-header"><span class="card-title">📊 月度趋势</span></div>
        <div class="card-body"><canvas id="financeChart" height="250"></canvas></div>
      </div>
    </div>
    <div class="card animate-fadeInUp stagger-5">
      <div class="card-header"><span class="card-title">🏗️ 基础设施成本</span></div>
      <div class="card-body"><div class="table-container"><table class="data-table">
        <thead><tr><th>项目</th><th>服务商</th><th>月费</th></tr></thead>
        <tbody>${MOCK.finance.infrastructure.map(i => `<tr><td>${i.item}</td><td>${i.provider}</td><td>¥${i.cost}</td></tr>`).join('')}</tbody>
      </table></div></div>
    </div>`;
  setTimeout(renderFinanceChart, 200);
}

function renderFinanceChart() {
  const ctx = document.getElementById('financeChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MOCK.finance.monthly.map(m => m.month),
      datasets: [{
        label: '营收', data: MOCK.finance.monthly.map(m => m.revenue),
        backgroundColor: 'rgba(99,102,241,0.6)', borderRadius: 6
      },{
        label: '成本', data: MOCK.finance.monthly.map(m => m.cost),
        backgroundColor: 'rgba(239,68,68,0.5)', borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { display: false } },
        y: { ticks: { color: '#64748b', callback: v => '¥'+v }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}
