// OPC OS — Page Renderers (Dashboard, Org, Tasks, Agents)

function renderDashboard() {
  const s = MOCK.stats;
  const revGrowth = ((s.monthlyRevenue - s.lastMonthRevenue) / s.lastMonthRevenue * 100).toFixed(1);
  const userGrowth = ((s.activeUsers - s.lastMonthUsers) / s.lastMonthUsers * 100).toFixed(1);
  document.getElementById('dashboardContent').innerHTML = `
    <div class="stat-grid">
      <div class="stat-card animate-fadeInUp stagger-1">
        <div class="stat-icon" style="background:rgba(99,102,241,0.15);color:#6366f1">🤖</div>
        <div class="stat-value" data-count="${s.activeAgents}">${s.activeAgents}</div>
        <div class="stat-label">活跃 Agent</div>
        <div class="stat-change up">● 全部在线</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-2">
        <div class="stat-icon" style="background:rgba(6,214,160,0.15);color:#06d6a0">💰</div>
        <div class="stat-value">¥<span data-count="${s.monthlyRevenue}">0</span></div>
        <div class="stat-label">本月营收</div>
        <div class="stat-change up">↑ ${revGrowth}%</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-3">
        <div class="stat-icon" style="background:rgba(245,158,11,0.15);color:#f59e0b">📋</div>
        <div class="stat-value"><span data-count="${s.tasksCompleted}">0</span>/${s.tasksToday}</div>
        <div class="stat-label">今日任务完成</div>
        <div class="stat-change up">完成率 ${(s.tasksCompleted/s.tasksToday*100).toFixed(0)}%</div>
      </div>
      <div class="stat-card animate-fadeInUp stagger-4">
        <div class="stat-icon" style="background:rgba(59,130,246,0.15);color:#3b82f6">👥</div>
        <div class="stat-value" data-count="${s.activeUsers}">0</div>
        <div class="stat-label">活跃用户</div>
        <div class="stat-change up">↑ ${userGrowth}%</div>
      </div>
    </div>
    <div class="grid-2" style="margin-bottom:24px">
      <div class="card animate-fadeInUp stagger-3">
        <div class="card-header"><span class="card-title">📈 营收趋势 (近7天)</span></div>
        <div class="card-body"><canvas id="revenueChart" height="220"></canvas></div>
      </div>
      <div class="card animate-fadeInUp stagger-4">
        <div class="card-header"><span class="card-title">⚡ 实时动态</span></div>
        <div class="card-body">
          <div class="activity-feed">${MOCK.activityLog.map(a => `
            <div class="activity-item">
              <span class="activity-time">${a.time}</span>
              <span class="activity-agent">${a.agent}</span>
              <span class="activity-text">${a.action}</span>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
      <div class="card animate-fadeInUp stagger-5">
      <div class="card-header"><span class="card-title">🤖 Agent 状态概览</span></div>
      <div class="card-body">
        <div class="agent-overview-grid">${appState.agents.map(a => `
          <div class="agent-overview-card">
            <div class="agent-ov-header">
              <span class="agent-ov-avatar" style="background:${a.color}">${a.avatar}</span>
              <div><div class="agent-ov-name">${a.name}</div><div class="agent-ov-role">${a.role}</div></div>
              <span class="status-dot ${a.status}"></span>
            </div>
            <div class="agent-ov-progress">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="font-size:12px;color:var(--text-muted)">任务进度</span>
                <span style="font-size:12px;color:var(--text-secondary)">${a.tasks?.completed||0}/${a.tasks?.total||0}</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width:${((a.tasks?.completed||0)/(a.tasks?.total||1)*100).toFixed(0)}%;background:${a.color}"></div></div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- 商业闭环飞轮 -->
    <div class="card animate-fadeInUp stagger-5" style="margin-bottom:24px">
      <div class="card-header">
        <span class="card-title">🔄 商业闭环飞轮 · 初序健康</span>
        <span class="badge badge-success" style="font-size:11px">6 环节全链路</span>
      </div>
      <div class="card-body">
        <div class="funnel-flow">${MOCK.funnel.map((f, i) => {
          const pageMap = {'流量获取':'tasks','AI 客服':'userops','人群筛选':'userops','社群运营':'community','精准营销':'marketing','复购裂变':'marketing'};
          const target = pageMap[f.step] || 'dashboard';
          return `
          <div class="funnel-step ${f.status}" onclick="navigateTo('${target}')" style="cursor:pointer" title="点击查看详情">
            <div class="funnel-icon">${f.icon}</div>
            <div class="funnel-name">${f.step}</div>
            <div class="funnel-metric">${f.metric}</div>
            <div class="funnel-agent">🤖 ${f.agent}</div>
            <div class="funnel-desc">${f.desc}</div>
            <div class="funnel-status-tag">${f.status === 'active' ? '✅ 已上线' : '🔨 建设中'}</div>
          </div>
          ${i < MOCK.funnel.length - 1 ? '<div class="funnel-arrow">→</div>' : ''}
        `}).join('')}
        </div>
      </div>
    </div>

    <!-- 转化漏斗 -->
    <div class="grid-2">
      <div class="card animate-fadeInUp stagger-5">
        <div class="card-header"><span class="card-title">📊 转化漏斗</span></div>
        <div class="card-body">
          <div class="conversion-funnel">${MOCK.conversionFunnel.map((f, i) => {
            const maxVal = MOCK.conversionFunnel[0].value;
            const widthPct = Math.max((f.value / maxVal) * 100, 12);
            const rate = i > 0 ? ((f.value / MOCK.conversionFunnel[i-1].value) * 100).toFixed(1) + '%' : '100%';
            return `
            <div class="funnel-bar-row">
              <div class="funnel-bar-label">${f.label}</div>
              <div class="funnel-bar-track">
                <div class="funnel-bar-fill" style="width:${widthPct}%;background:${f.color}">
                  <span>${f.value.toLocaleString()}</span>
                </div>
              </div>
              <div class="funnel-bar-rate">${rate}</div>
            </div>`;
          }).join('')}
          </div>
        </div>
      </div>
      <div class="card animate-fadeInUp stagger-5">
        <div class="card-header"><span class="card-title">💡 核心商业逻辑</span></div>
        <div class="card-body">
          <div class="biz-logic-list">
            <div class="biz-logic-item">
              <div class="biz-logic-icon" style="background:rgba(99,102,241,0.15);color:#6366f1">💰</div>
              <div>
                <div class="biz-logic-title">利润来源</div>
                <div class="biz-logic-desc">CPS 佣金（养生茶/食材/外卖红包）+ 自有品牌产品</div>
              </div>
            </div>
            <div class="biz-logic-item">
              <div class="biz-logic-icon" style="background:rgba(6,214,160,0.15);color:#06d6a0">🎯</div>
              <div>
                <div class="biz-logic-title">核心差异</div>
                <div class="biz-logic-desc">AI 体质画像驱动精准推荐，每个人看到不同的商城</div>
              </div>
            </div>
            <div class="biz-logic-item">
              <div class="biz-logic-icon" style="background:rgba(245,158,11,0.15);color:#f59e0b">📈</div>
              <div>
                <div class="biz-logic-title">增长飞轮</div>
                <div class="biz-logic-desc">免费测评获客 → 社群养信任 → 精准转化 → 复购裂变</div>
              </div>
            </div>
            <div class="biz-logic-item">
              <div class="biz-logic-icon" style="background:rgba(236,72,153,0.15);color:#ec4899">🏦</div>
              <div>
                <div class="biz-logic-title">财务目标</div>
                <div class="biz-logic-desc">月成本 ¥500-1000 · Phase 1 目标月营收 ≥ ¥1,860</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  // Animate counters
  setTimeout(() => {
    document.querySelectorAll('[data-count]').forEach(el => {
      animateCount(el, parseFloat(el.dataset.count));
    });
    renderRevenueChart();
  }, 200);
}

function renderRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: MOCK.revenueTrend.map(d => d.date),
      datasets: [{
        label: '营收', data: MOCK.revenueTrend.map(d => d.revenue),
        borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)',
        fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#6366f1'
      }, {
        label: '成本', data: MOCK.revenueTrend.map(d => d.cost),
        borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)',
        fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#ef4444'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } } },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#64748b', callback: v => '¥'+v }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

function renderOrg() {
  document.getElementById('orgContent').innerHTML = `
    <div class="org-tree animate-fadeIn">
      <div class="org-node org-ceo" style="margin-bottom: 30px;">
        <div class="org-node-card ceo-card">
          <div class="org-avatar ceo-avatar">👑</div>
          <div class="org-name">Zoey</div>
          <div class="org-role">CEO · 创始人</div>
          <div class="badge badge-success" style="margin-top:8px">在线</div>
        </div>
      </div>
      <div class="org-connector"></div>
      <div class="org-level" style="display: flex; gap: 24px; flex-wrap: wrap; justify-content: center;">
        ${appState.departments.map((d, i) => {
          const deptAgents = appState.agents.filter(a => a.deptId === d.id);
          return `<div class="org-branch animate-fadeInUp stagger-${i+1}" style="flex:1; min-width: 260px; max-width:320px; background: rgba(30,30,40,0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 16px; display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div class="org-dept-label" style="margin:0; background:transparent;">${d.icon} ${d.name}</div>
              <button class="btn btn-primary" style="padding:4px 8px; font-size:12px;" onclick="openAgentWizard(${i})">+ 添加员工</button>
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.05); padding-top:12px;">
              ${deptAgents.length === 0 ? '<div style="color:var(--text-muted); font-size:12px; text-align:center;">暂无员工</div>' : ''}
              ${deptAgents.map(agent => `
                <div class="org-node-card agent-card" style="border-left:3px solid ${agent.color}; margin-bottom: 8px; flex-direction:row; align-items:center; text-align:left; padding: 12px; gap: 12px; background: rgba(0,0,0,0.2);">
                  <div class="org-avatar" style="background:${agent.color}; width:40px; height:40px; font-size:20px;">${agent.avatar}</div>
                  <div style="flex:1;">
                    <div class="org-name" style="font-size:14px;">${agent.name} <span class="status-dot ${agent.status}" style="display:inline-block; margin-left:4px; transform:translateY(1px)"></span></div>
                    <div class="org-role" style="font-size:12px;">${agent.role}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>`;
        }).join('')}
        
        <!-- 未分配/待岗的 Agent -->
        ${appState.agents.filter(a => !a.deptId || !appState.departments.find(d=>d.id===a.deptId)).length > 0 ? `
          <div class="org-branch animate-fadeInUp" style="flex:1; min-width: 260px; max-width:320px; background: rgba(30,30,40,0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 16px; display:flex; flex-direction:column; gap:12px;">
            <div class="org-dept-label" style="margin:0; background:transparent;">☕ 待岗/未分配</div>
            <div style="border-top:1px solid rgba(255,255,255,0.05); padding-top:12px;">
              ${appState.agents.filter(a => !a.deptId || !appState.departments.find(d=>d.id===a.deptId)).map(agent => `
                <div class="org-node-card agent-card" style="border-left:3px solid ${agent.color}; margin-bottom: 8px; flex-direction:row; align-items:center; text-align:left; padding: 12px; gap: 12px; background: rgba(0,0,0,0.2); filter: grayscale(0.5);">
                  <div class="org-avatar" style="background:${agent.color}; width:40px; height:40px; font-size:20px;">${agent.avatar}</div>
                  <div style="flex:1;">
                    <div class="org-name" style="font-size:14px; color:var(--text-muted)">${agent.name} <span class="status-dot offline" style="display:inline-block; margin-left:4px;"></span></div>
                    <div class="org-role" style="font-size:12px;">${agent.role}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>`;
}

function renderTasks() {
  const statusCols = ['todo','in-progress','review','completed'];
  const statusNames = { todo:'📝 待办', 'in-progress':'🔄 进行中', review:'👀 审核中', completed:'✅ 已完成' };
  document.getElementById('tasksContent').innerHTML = `
    <div class="task-board">${statusCols.map(col => `
      <div class="task-column animate-fadeInUp">
        <div class="task-col-header">
          <span>${statusNames[col]}</span>
          <span class="task-col-count">${MOCK.tasks.filter(t=>t.status===col).length}</span>
        </div>
        <div class="task-col-body">${MOCK.tasks.filter(t=>t.status===col).map(t => `
          <div class="task-card" draggable="true">
            <div class="task-priority">${getPriorityIcon(t.priority)}</div>
            <div class="task-title">${t.title}</div>
            <div class="task-meta">
              <span class="task-assignee">${MOCK.agents.find(a=>a.name===t.assignee)?.avatar||'👤'} ${t.assignee}</span>
              <span class="task-due">${t.dueDate}</span>
            </div>
          </div>`).join('')}
        </div>
      </div>`).join('')}
    </div>`;
}

function renderAgents() {
  document.getElementById('agentsContent').innerHTML = `
    <div class="grid-2">${appState.agents.map((a, i) => {
      const deptName = appState.departments.find(d => d.id === a.deptId)?.name || '未分配待岗';
      return `
      <div class="card animate-fadeInUp stagger-${(i%5)+1}" style="border-top:3px solid ${a.color}; position:relative">
        <div class="card-body">
          <div style="position:absolute; top:12px; right:12px;">
            <button class="icon-btn danger" style="width:28px;height:28px;font-size:14px;" onclick="showDeleteConfirm('agent', ${i})" title="解雇员工">🗑️</button>
          </div>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
            <div style="width:56px;height:56px;border-radius:14px;background:${a.color};display:flex;align-items:center;justify-content:center;font-size:28px">${a.avatar}</div>
            <div style="flex:1">
              <div style="font-size:20px;font-weight:700">${a.name}</div>
              <div style="font-size:13px;color:var(--text-secondary)">${a.role} · ${deptName}</div>
            </div>
            <span class="status-dot ${!a.deptId ? 'offline' : a.status}"></span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
            ${(a.skills||[]).map(s => `<span class="badge badge-primary">${s}</span>`).join('')}
          </div>
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
              <span style="color:var(--text-muted)">Token 用量</span>
              <span style="color:var(--text-secondary)">${formatNumber(a.tokenUsage||0)} / ${formatNumber(a.tokenBudget||100)}</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${((a.tokenUsage||0)/(a.tokenBudget||1)*100).toFixed(0)}%;background:${a.color}"></div></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary)">
            <span>平台: ${a.platform}</span><span>状态: ${!a.deptId ? '待岗喝咖啡' : a.status==='online'?'在线工作中':a.status==='busy'?'处理任务中':'离线'}</span>
          </div>
        </div>
      </div>`;
    }).join('')}
    </div>`;
}
