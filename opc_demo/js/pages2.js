// OPC OS — Page Renderers Part 2 (UserOps, Marketing, CPreview, Community, Finance)

// ===== 读取C端共享数据 =====
function getSharedData() {
  return JSON.parse(localStorage.getItem('opc_shared_data') || '{"users":[],"assessmentCount":347,"todayNewUsers":12,"referralCount":34,"orders":[]}');
}

// ===== 用户运营 =====
function renderUserOps() {
  const shared = getSharedData();
  const totalUsers = shared.assessmentCount || 347;
  const todayNew = shared.todayNewUsers || 12;
  const users = shared.users || [];

  // 体质分布数据
  const typeDistMap = {};
  const typeColors = {'木型体质':'#059669','火型体质':'#ef4444','土型体质':'#f59e0b','金型体质':'#6366f1','水型体质':'#3b82f6'};
  const defaultDist = [
    {type:'木型体质',count:122,pct:35},
    {type:'火型体质',count:59,pct:17},
    {type:'土型体质',count:87,pct:25},
    {type:'金型体质',count:45,pct:13},
    {type:'水型体质',count:34,pct:10}
  ];

  // AI客服对话流模拟
  const chatFlow = [
    {time:'14:03',user:'小雨',src:'小红书',msg:'我最近老是失眠怎么办',ai:'了解，失眠和体质有关，建议先做个测评',action:'✅ 用户点击了测评链接'},
    {time:'14:01',user:'阿文',src:'抖音',msg:'有什么养胃的东西推荐吗',ai:'推荐山药薏米粉，适合脾胃虚弱的人',action:'✅ 用户点击了商品链接'},
    {time:'13:55',user:'大伟',src:'视频号',msg:'谷雨节气吃什么好',ai:'谷雨宜清肝养脾，推荐菊花枸杞茶',action:'✅ 用户完成测评'},
  ];

  document.getElementById('useropsContent').innerHTML = `
    <div class="stat-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card animate-fadeInUp stagger-1">
        <div class="stat-icon" style="background:rgba(16,185,129,0.15);color:#10b981">📊</div>
        <div class="stat-value">${totalUsers}</div>
        <div class="stat-label">累计测评完成</div>
        <div class="stat-change up">今日 +${todayNew}</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-2">
        <div class="stat-icon" style="background:rgba(59,130,246,0.15);color:#3b82f6">🏷️</div>
        <div class="stat-value">${users.length || 89}</div>
        <div class="stat-label">高价值用户</div>
        <div class="stat-change up">标签覆盖率 92%</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-3">
        <div class="stat-icon" style="background:rgba(245,158,11,0.15);color:#f59e0b">📈</div>
        <div class="stat-value">68%</div>
        <div class="stat-label">用户留存率</div>
        <div class="stat-change up">↑ 5.2%</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:24px">
      <div class="card animate-fadeInUp stagger-3">
        <div class="card-header"><span class="card-title">🎯 用户画像分布</span></div>
        <div class="card-body">
          <div class="body-type-stats">${defaultDist.map(d => `
            <div class="body-type-row" style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <span style="width:70px;font-size:13px;font-weight:600;color:${typeColors[d.type]}">${d.type}</span>
              <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${d.pct}%;background:${typeColors[d.type]}"></div></div>
              <span style="font-size:12px;color:var(--text-muted);width:60px;text-align:right">${d.count}人 (${d.pct}%)</span>
            </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card animate-fadeInUp stagger-4">
        <div class="card-header"><span class="card-title">📡 渠道来源</span></div>
        <div class="card-body">
          ${[{ch:'小红书',pct:45,color:'#ff2442'},{ch:'抖音',pct:30,color:'#000'},{ch:'视频号',pct:15,color:'#07c160'},{ch:'裂变分享',pct:10,color:'#f59e0b'}].map(c => `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <span style="width:70px;font-size:13px;font-weight:600">${c.ch}</span>
              <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${c.pct}%;background:${c.color}"></div></div>
              <span style="font-size:12px;color:var(--text-muted);width:40px;text-align:right">${c.pct}%</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="card animate-fadeInUp stagger-4" style="margin-bottom:24px">
      <div class="card-header"><span class="card-title">🤖 AI 客服实时动态</span><span class="badge badge-success" style="font-size:11px">今日接待 47 人 · 转化率 49%</span></div>
      <div class="card-body" style="max-height:260px;overflow-y:auto">
        ${chatFlow.map(c => `
          <div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:12px;margin-bottom:8px;border-left:3px solid #10b981">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-weight:600">● 知远 → ${c.user}<span style="color:var(--text-muted);font-size:12px;margin-left:8px">${c.src}来源</span></span>
              <span style="color:var(--text-muted);font-size:12px">${c.time}</span>
            </div>
            <div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px">用户：${c.msg}</div>
            <div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px">AI：${c.ai}</div>
            <div style="font-size:12px;color:#10b981">${c.action}</div>
          </div>`).join('')}
      </div>
    </div>

    <div class="card animate-fadeInUp stagger-5">
      <div class="card-header"><span class="card-title">👥 最近用户</span></div>
      <div class="card-body"><div class="table-container"><table class="data-table">
        <thead><tr><th>昵称</th><th>体质</th><th>渠道</th><th>标签</th><th>时间</th></tr></thead>
        <tbody>${(users.length > 0 ? users.slice(0,8) : [
          {nickname:'小雨',bodyType:'木型体质',channel:'小红书',tags:['木型体质(肝火偏旺)','高频咨询(3天连问)'],assessmentDate:'2026-04-24'},
          {nickname:'阿文',bodyType:'水型体质',channel:'抖音',tags:['水型体质(肾气不足)','湿气重','待逼单'],assessmentDate:'2026-04-24'},
          {nickname:'大伟',bodyType:'金型体质',channel:'视频号',tags:['金型体质','已完成初测'],assessmentDate:'2026-04-23'},
          {nickname:'晓晓',bodyType:'木型体质',channel:'裂变',tags:['脾胃虚寒','待逼单'],assessmentDate:'2026-04-23'},
          {nickname:'明月',bodyType:'金型体质',channel:'小红书',tags:['睡眠障碍','高频咨询(3天连问)'],assessmentDate:'2026-04-22'},
        ]).map(u => `<tr>
          <td style="font-weight:600">${u.nickname}</td>
          <td><span class="badge badge-primary">${u.bodyType}</span></td>
          <td>${u.channel}</td>
          <td>${(u.tags||[]).map(t=>'<span class="badge badge-success" style="font-size:11px;margin-right:4px">'+t+'</span>').join('')}</td>
          <td style="color:var(--text-muted)">${u.assessmentDate}</td>
        </tr>`).join('')}</tbody>
      </table></div></div>
    </div>`;
}

// ===== 营销中心 =====
function renderMarketing() {
  const shared = getSharedData();
  const refCount = shared.referralCount || 34;

  document.getElementById('marketingContent').innerHTML = `
    <div class="stat-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card animate-fadeInUp stagger-1">
        <div class="stat-icon" style="background:rgba(99,102,241,0.15);color:#6366f1">⚙️</div>
        <div class="stat-value">5</div>
        <div class="stat-label">活跃 SOP 规则</div>
        <div class="stat-change up">全部运行中</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-2">
        <div class="stat-icon" style="background:rgba(245,158,11,0.15);color:#f59e0b">🎫</div>
        <div class="stat-value">128</div>
        <div class="stat-label">本月发放优惠券</div>
        <div class="stat-change up">↑ 23%</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-3">
        <div class="stat-icon" style="background:rgba(16,185,129,0.15);color:#10b981">🔄</div>
        <div class="stat-value">${refCount}</div>
        <div class="stat-label">裂变新增用户</div>
        <div class="stat-change up">转化率 39%</div>
      </div>
    </div>

    <div class="card animate-fadeInUp stagger-4" style="margin-bottom:24px">
      <div class="card-header"><span class="card-title">⚙️ SOP 自动化任务</span><span class="badge badge-success" style="font-size:11px">全部运行中</span></div>
      <div class="card-body"><div class="table-container"><table class="data-table">
        <thead><tr><th>规则名称</th><th>触发条件</th><th>执行动作</th><th>状态</th></tr></thead>
        <tbody>
          <tr><td style="font-weight:600">立夏节气自动关怀推送</td><td>节气到达立夏</td><td>推送立夏养心指南</td><td><span class="badge badge-success">✅ 执行中</span></td></tr>
          <tr><td style="font-weight:600">湿气重人群-祛湿茶逼单</td><td>体质含"湿气"且咨询>2次</td><td>推送红豆薏米茶优惠</td><td><span class="badge badge-success">✅ 执行中</span></td></tr>
          <tr><td style="font-weight:600">连续熬夜关怀 SOP</td><td>夜间23:00后活跃>3次</td><td>推送安神助眠套餐</td><td><span class="badge badge-success">✅ 执行中</span></td></tr>
          <tr><td style="font-weight:600">新用户欢迎</td><td>加好友后 1 小时</td><td>推送体质测评链接</td><td><span class="badge badge-success">✅ 执行中</span></td></tr>
          <tr><td style="font-weight:600">复购提醒</td><td>购买 30 天后</td><td>推送复购优惠</td><td><span class="badge badge-success">✅ 执行中</span></td></tr>
        </tbody>
      </table></div></div>
    </div>

    <div class="grid-2" style="margin-bottom:24px">
      <div class="card animate-fadeInUp stagger-5">
        <div class="card-header"><span class="card-title">🎁 裂变活动</span></div>
        <div class="card-body">
          <div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:16px;margin-bottom:12px;border:1px solid rgba(245,158,11,0.2)">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="font-weight:600">邀请好友测体质</span>
              <span class="badge badge-success">进行中</span>
            </div>
            <div style="display:flex;gap:20px;font-size:13px;color:var(--text-secondary)">
              <span>参与 87 人</span><span>带新 ${refCount} 人</span><span>转化 39%</span>
            </div>
          </div>
          <div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:16px;border:1px solid rgba(99,102,241,0.2)">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="font-weight:600">春季养肝茶拼团</span>
              <span class="badge badge-success">进行中</span>
            </div>
            <div style="display:flex;gap:20px;font-size:13px;color:var(--text-secondary)">
              <span>参与 42 人</span><span>成团 18 组</span><span>GMV ¥680</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card animate-fadeInUp stagger-5">
        <div class="card-header"><span class="card-title">📨 推送任务</span><button class="btn btn-primary btn-sm" onclick="showToast('推送任务已创建','success')">+ 创建推送</button></div>
        <div class="card-body"><div class="table-container"><table class="data-table">
          <thead><tr><th>目标标签</th><th>推送内容</th><th>覆盖</th><th>状态</th></tr></thead>
          <tbody>
            <tr><td>木型体质</td><td>养肝茶专享价</td><td>122人</td><td><span class="badge badge-success">已发送</span></td></tr>
            <tr><td>高意向</td><td>限时优惠提醒</td><td>89人</td><td><span class="badge badge-warning">待发送</span></td></tr>
            <tr><td>沉默7天</td><td>节气养生唤醒</td><td>34人</td><td><span class="badge badge-success">已发送</span></td></tr>
          </tbody>
        </table></div></div>
      </div>
    </div>`;
}

// ===== C端预览 =====
function renderCPreview() {
  document.getElementById('cpreviewContent').innerHTML = `
    <div style="display:flex;gap:24px;align-items:flex-start">
      <div style="flex:1;display:flex;flex-direction:column;gap:12px">
        <div class="card">
          <div class="card-header"><span class="card-title">📱 快捷导航</span></div>
          <div class="card-body">
            <div style="display:flex;flex-direction:column;gap:8px">
              <button class="btn btn-primary btn-sm" style="width:100%" onclick="document.getElementById('cPreviewFrame').src='user_app/index.html'">🏠 首页</button>
              <button class="btn btn-secondary btn-sm" style="width:100%" onclick="document.getElementById('cPreviewFrame').contentWindow.goTo('assess')">🔍 测评</button>
              <button class="btn btn-secondary btn-sm" style="width:100%" onclick="document.getElementById('cPreviewFrame').contentWindow.goTo('mall')">🛒 商城</button>
              <button class="btn btn-secondary btn-sm" style="width:100%" onclick="document.getElementById('cPreviewFrame').contentWindow.goTo('profile')">👤 个人中心</button>
              <button class="btn btn-secondary btn-sm" style="width:100%" onclick="document.getElementById('cPreviewFrame').contentWindow.goTo('share')">🎁 裂变分享</button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">📊 实时数据</span></div>
          <div class="card-body" style="font-size:13px;color:var(--text-secondary)">
            <div style="margin-bottom:8px">🟢 当前在线用户：<strong>23</strong></div>
            <div style="margin-bottom:8px">📈 今日访问量：<strong>156</strong></div>
            <div>🔍 今日测评完成：<strong>${getSharedData().todayNewUsers || 12}</strong></div>
          </div>
        </div>
        <a href="user_app/index.html" target="_blank" class="btn btn-secondary btn-sm" style="text-align:center;text-decoration:none">在新窗口打开 ↗</a>
      </div>
      <div style="flex:0 0 auto">
        <div style="width:390px;height:750px;background:#1a1a2e;border-radius:40px;padding:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);position:relative">
          <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:120px;height:28px;background:#1a1a2e;border-radius:0 0 16px 16px;z-index:2"></div>
          <iframe id="cPreviewFrame" src="user_app/index.html" style="width:100%;height:100%;border:none;border-radius:28px;background:#fff"></iframe>
        </div>
      </div>
    </div>`;
}

// ===== 社群管理 (保留原有) =====
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

// ===== 财务中心 (保留原有) =====
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
