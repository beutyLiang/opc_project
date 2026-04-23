// ===== Pixel Office + CRUD System =====
// Renders isometric office with animated agent characters
// Supports department & agent CRUD operations

// ---- Auto-Refresh Activity Simulation ----
const _agentActivities = [
  '📊 分析数据', '✍️ 撰写报告', '🔍 竞品调研', '📱 社群运营',
  '📝 内容创作', '💡 方案策划', '🎯 精准营销', '📈 数据复盘',
  '🤝 客户沟通', '⚡ 处理任务', '📋 整理素材', '🎨 设计方案'
];

function _tickAgentActivity() {
  if (!appState || !appState.agents || appState.agents.length === 0) return;

  // 检查是否有进行中的任务
  const runningTasks = (appState.taskHistory || []).filter(t => t.status === 'running');
  const busyAgentIds = new Set(runningTasks.map(t => t.agentId));

  appState.agents.forEach(a => {
    if (!a) return;
    // Agent 状态严格跟随任务系统：有 running 任务 = busy，否则 = online
    if (busyAgentIds.has(a.id)) {
      a.status = 'busy';
    } else if (a.status === 'busy') {
      a.status = 'online'; // 没有进行中任务，不该是 busy
    }
    // 小幅递增 token 使用量（仅在 online/busy 状态下）
    if (a.status !== 'offline' && a.tokenUsage !== undefined) {
      a.tokenUsage = Math.min(a.tokenBudget || 10, +(a.tokenUsage + Math.random() * 0.1).toFixed(1));
    }
  });
  saveState();

  // ====== 局部 DOM 更新（不引起全局闪烁） ======
  
  // 1. 更新顶部状态栏的时间
  const clocks = document.querySelectorAll('.pixel-office-clock');
  const timeStr = '🕐 ' + new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});
  clocks.forEach(clock => clock.textContent = timeStr);

  // 2. 随机更新正在忙碌的 Agent 的气泡文字
  // 只选出在工位上（有 .typing 类）的气泡
  const typingBubbles = document.querySelectorAll('.agent-char.typing .char-bubble');
  typingBubbles.forEach(bubble => {
    // 排除 CEO 的气泡（或者内容固定的气泡）
    if (bubble.textContent && !bubble.textContent.includes('审批营销方案')) {
      bubble.textContent = _agentActivities[Math.floor(Math.random() * _agentActivities.length)];
    }
  });
}

// ---- State Management ----
let appState = JSON.parse(localStorage.getItem('opc_appState')) || {
  departments: JSON.parse(JSON.stringify(MOCK.departments)),
  agents: JSON.parse(JSON.stringify(MOCK.agents)),
  taskHistory: [],
  activePopup: null
};

// 启动时数据完整性修复
(function fixDataIntegrity() {
  // 1. 修复孤儿部门引用
  const deptIds = new Set(appState.departments.map(d => d.id));
  appState.agents.forEach(a => {
    if (a && a.deptId && !deptIds.has(a.deptId)) {
      const matchByHead = appState.departments.find(d => d.head === a.name);
      if (matchByHead) {
        a.deptId = matchByHead.id;
      }
    }
  });

  // 2. 修复幽灵任务状态：如果没有进行中的任务，Agent不可能是busy
  const hasActiveTasks = appState.taskHistory && appState.taskHistory.some(t => t.status === 'running');
  if (!hasActiveTasks) {
    appState.agents.forEach(a => {
      if (a && a.status === 'busy') {
        a.status = 'online';
      }
    });
  }
})();

function saveState() {
  localStorage.setItem('opc_appState', JSON.stringify(appState));
}

function renderPixelOffice() {
  const busyAgents = appState.agents.filter(a => a && a.status === 'busy');
  const idleAgents = appState.agents.filter(a => a && a.status !== 'busy');
  
  const breakOffsets = [-120, -40, 40, 120];
  let breakIndex = 0;

  return `
    <div class="pixel-office-wrapper">
      <div class="pixel-office-header">
        <h3>🏢 像素办公室 · 鸟瞰视图</h3>
        <div class="office-status-bar">
          <span><span class="ws-status-dot" style="background:#06d6a0;box-shadow:0 0 6px rgba(6,214,160,0.5)"></span> 在工位 ${busyAgents.length}</span>
          <span><span class="ws-status-dot" style="background:#64748b"></span> 休息中 ${idleAgents.length}</span>
          <span class="pixel-office-clock">🕐 ${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}</span>
        </div>
      </div>
      <div class="office-floor" id="officeFloor">
        
        <!-- CEO Room -->
        <div class="room ceo-room">
          <div class="room-label">👑 CEO 办公室</div>
          <div class="room-glass-glare"></div>
          <div class="workstation" onclick="showAgentPopup(event,'ceo')">
            <div class="agent-char typing">
              <div class="char-bubble">🎯 审批营销方案</div>
              <div class="char-body">
                <div class="char-head" style="background:#06d6a0"></div>
                <div class="char-torso" style="background:#059669"></div>
                <div class="char-arms"><div class="char-arm" style="background:#06d6a0"></div><div class="char-arm" style="background:#06d6a0"></div></div>
              </div>
            </div>
            <div class="ws-desk"><div class="ws-monitor active"></div></div>
            <div class="ws-label"><div class="ws-name">Zoey</div><div class="ws-role">CEO</div></div>
          </div>
        </div>

        <!-- Break Room -->
        <div class="room break-room">
          <div class="room-label">☕ 休闲区 & 咖啡吧</div>
          <div class="sofa"></div>
          <div class="coffee-table"></div>

        <!-- Relaxing / Idle / Unassigned Agents in Break Room -->
        ${appState.agents.filter(a => a && a.status !== 'busy').map((a) => {
          const offset = breakOffsets[breakIndex % 4] || 0;
          breakIndex++;
          let bubbleText = '☕ 喝咖啡';
          if (a.status === 'offline') bubbleText = '💤 休息中';
          else if (!a.deptId || !appState.departments.find(d=>d.id===a.deptId)) bubbleText = '💼 待岗中';
          
          return `
            <div class="agent-char relaxing" style="bottom: 45px; left: calc(50% + ${offset}px); cursor: pointer; z-index: 20" onclick="showAgentPopup(event,'${a.id}')">
              <div class="char-bubble">${bubbleText}</div>
              <div class="char-body">
                <div class="char-head" style="background:${a.color}"></div>
                <div class="char-torso" style="background:${a.color}88"></div>
                <div class="coffee-cup"></div>
              </div>
              <div class="ws-label" style="position:absolute; top:100%; width:80px; left:-29px; text-align:center;">
                <div class="ws-name"><span class="ws-status-dot" style="background:${a.status === 'offline' ? '#64748b' : (!a.deptId || !appState.departments.find(d=>d.id===a.deptId) ? '#f59e0b' : '#10b981')}"></span>${a.name}</div>
              </div>
            </div>
          `;
        }).join('')}

        <!-- Busy but Unassigned Agents (临时工位) -->
        ${appState.agents.filter(a => a && a.status === 'busy' && (!a.deptId || !appState.departments.find(d=>d.id===a.deptId))).map((a) => {
          const offset = breakOffsets[breakIndex % 4] || 0;
          breakIndex++;
          return `
            <div class="workstation" style="position:absolute; bottom:45px; left:calc(50% + ${offset}px); z-index:20; cursor:pointer" onclick="showAgentPopup(event,'${a.id}')">
              <div class="agent-char typing">
                <div class="char-bubble">${_agentActivities[Math.floor(Math.random() * _agentActivities.length)]}</div>
                <div class="char-body">
                  <div class="char-head" style="background:${a.color}"></div>
                  <div class="char-torso" style="background:${a.color}88"></div>
                  <div class="char-arms"><div class="char-arm" style="background:${a.color}"></div><div class="char-arm" style="background:${a.color}"></div></div>
                </div>
              </div>
              <div class="ws-desk"><div class="ws-monitor active"></div></div>
              <div class="ws-label" style="position:absolute;top:100%;width:80px;left:-10px;text-align:center">
                <div class="ws-name"><span class="ws-status-dot" style="background:${a.color};box-shadow:0 0 6px ${a.color}"></span>${a.name}</div>
              </div>
            </div>
          `;
        }).join('')}

        </div>

        <!-- Department Rooms -->
        ${appState.departments.map((dept, i) => {
          const deptAgents = appState.agents.filter(a => a && a.deptId === dept.id && a.status === 'busy');
          return `
            <div class="room dept-room dept-room-${i % 4}" style="${i>3?'display:none':''}">
              <div class="room-label">${dept.icon} ${dept.name}</div>
              <div class="room-glass-glare"></div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; height: 100%; align-items: center; padding-top: 15px;">
              ${deptAgents.length > 0 ? deptAgents.map(a => {
                const isBusy = a.status === 'busy';
              const bubble = isBusy ? _agentActivities[Math.floor(Math.random() * _agentActivities.length)] : '💬 待命中';
                return `
                <div class="workstation" onclick="showAgentPopup(event,'${a.id}')">
                  <div class="agent-char ${isBusy ? 'typing' : ''}">
                    <div class="char-bubble">${bubble}</div>
                    <div class="char-body">
                      <div class="char-head" style="background:${a.color}"></div>
                      <div class="char-torso" style="background:${a.color}88"></div>
                      ${isBusy ? `<div class="char-arms"><div class="char-arm" style="background:${a.color}"></div><div class="char-arm" style="background:${a.color}"></div></div>` : ''}
                    </div>
                  </div>
                  <div class="ws-desk"><div class="ws-monitor ${isBusy ? 'active' : ''}"></div></div>
                  <div class="ws-label">
                    <div class="ws-name"><span class="ws-status-dot" style="background:${a.color};box-shadow:0 0 6px ${a.color}"></span>${a.name}</div>
                    <div class="ws-role" style="font-size:9px;">${a.role}</div>
                  </div>
                </div>`}).join('') : `
                <div class="workstation" style="opacity:0.3">
                  <div class="ws-desk"><div class="ws-monitor"></div></div>
                  <div class="ws-label"><div class="ws-role">空置工位</div></div>
                </div>
              `}
              </div>
            </div>
          `;
        }).join('')}



      </div>
    </div>`;
}

function showAgentPopup(event, agentId) {
  event.stopPropagation();
  document.querySelectorAll('.agent-popup').forEach(p => p.remove());
  const a = agentId === 'ceo'
    ? { name: 'Zoey', role: 'CEO · 创始人', avatar: '👑', color: '#06d6a0', status: 'online', platform: '人类', skills: ['战略决策','资源调配','品牌出镜'], tasks: { completed: 15, total: 18 }, tokenUsage: 0, tokenBudget: 1 }
    : appState.agents.find(x => x.id === agentId);
  if (!a) return;
  const popup = document.createElement('div');
  popup.className = 'agent-popup';
  popup.style.left = (event.clientX + 10) + 'px';
  popup.style.top = (event.clientY - 100) + 'px';
  popup.innerHTML = `
    <button class="agent-popup-close" onclick="this.parentElement.remove()">✕</button>
    <div class="agent-popup-header">
      <div class="agent-popup-avatar" style="background:${a.color}">${a.avatar || '👤'}</div>
      <div>
        <div style="font-weight:700">${a.name}</div>
        <div style="font-size:12px;color:var(--text-muted)">${a.role}</div>
      </div>
      <span class="status-dot ${a.status}"></span>
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">平台: ${a.platform} · ${getStatusText(a.status)}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px">${(a.skills||[]).map(s=>`<span class="badge badge-primary" style="font-size:10px">${s}</span>`).join('')}</div>
    ${agentId !== 'ceo' ? `
    <div style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">
        <span style="color:var(--text-muted)">任务</span><span>${a.tasks.completed}/${a.tasks.total}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${(a.tasks.completed/a.tasks.total*100)}%;background:${a.color}"></div></div>
    </div>` : ''}`;
  document.body.appendChild(popup);
  document.addEventListener('click', () => popup.remove(), { once: true });
}

// ---- Updated Dashboard with Pixel Office ----
const _origRenderDashboard = renderDashboard;
renderDashboard = function() {
  _origRenderDashboard();
  const content = document.getElementById('dashboardContent');
  // Insert pixel office after stat grid
  const statGrid = content.querySelector('.stat-grid');
  if (statGrid) {
    const officeDiv = document.createElement('div');
    officeDiv.style.marginBottom = '24px';
    officeDiv.className = 'animate-fadeInUp stagger-2';
    officeDiv.innerHTML = renderPixelOffice();
    statGrid.after(officeDiv);
  }
};

// ---- Org CRUD System ----
const _origRenderOrg = renderOrg;
renderOrg = function() {
  document.getElementById('orgContent').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <div>
        <span class="badge badge-primary">${appState.departments.length} 个部门</span>
        <span class="badge badge-success" style="margin-left:8px">${appState.agents.length} 个 Agent</span>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-secondary btn-sm" onclick="showDeptModal()">+ 新建部门</button>
        <button class="btn btn-primary btn-sm" onclick="showAgentWizard()">🤖 接入 Agent</button>
      </div>
    </div>
    ${renderPixelOffice()}
    <div style="margin-top:24px">
      <h3 style="margin-bottom:16px;font-size:16px;font-weight:600">📁 部门与岗位管理</h3>
      <div class="crud-list">${appState.departments.map((d, i) => {
        const deptAgents = appState.agents.filter(a => a.deptId === d.id);
        return `<div class="crud-item animate-fadeInUp stagger-${i+1}">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:24px">${d.icon}</span>
            <div>
              <div style="font-weight:600">${d.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">负责人: ${d.head} · ${deptAgents.length} 人</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            ${deptAgents.length > 0 
              ? deptAgents.map(agent => `<span class="badge badge-success" style="font-size:11px"><span class="status-dot ${agent.status}" style="margin-right:4px"></span>${agent.name} · ${agent.platform}</span>`).join('') 
              : '<span class="badge" style="background:rgba(255,255,255,0.05);color:var(--text-muted)">未分配 Agent</span>'}
            <div class="crud-item-actions">
              <button class="icon-btn" onclick="showEditDeptModal(${i})" title="编辑">✏️</button>
              <button class="icon-btn danger" onclick="showDeleteConfirm('dept',${i})" title="删除">🗑️</button>
            </div>
          </div>
        </div>`;
      }).join('')}</div>
    </div>`;
};

// ---- Department CRUD Modals ----
function showDeptModal(editIndex) {
  const isEdit = editIndex !== undefined;
  const dept = isEdit ? appState.departments[editIndex] : {};
  showModal(`
    <div class="modal-title">${isEdit ? '编辑部门' : '新建部门'}</div>
    <div class="input-group">
      <label class="input-label">部门名称</label>
      <input type="text" class="input" id="deptName" value="${dept.name || ''}" placeholder="例如：市场部">
    </div>
    <div class="input-group">
      <label class="input-label">部门图标</label>
      <div class="industry-select" style="grid-template-columns:repeat(6,1fr)">
        ${['🎯','⚡','✍️','📊','🎨','🔬','📱','💼'].map(e => `<button class="industry-btn ${dept.icon===e?'active':''}" onclick="selectIcon(this)" data-icon="${e}">${e}</button>`).join('')}
      </div>
    </div>
    <div class="input-group">
      <label class="input-label">负责人</label>
      <input type="text" class="input" id="deptHead" value="${dept.head || ''}" placeholder="岗位负责人名称">
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="${isEdit ? `saveDept(${editIndex})` : 'createDept()'}">${isEdit ? '保存' : '创建'}</button>
    </div>`);
}

function showEditDeptModal(i) { showDeptModal(i); }

function selectIcon(btn) {
  btn.parentElement.querySelectorAll('.industry-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function createDept() {
  const name = document.getElementById('deptName').value.trim();
  const icon = document.querySelector('#modalContainer .industry-btn.active')?.dataset.icon || '📁';
  const head = document.getElementById('deptHead').value.trim() || '待分配';
  if (!name) { showToast('请输入部门名称', 'error'); return; }
  appState.departments.push({ id: 'd' + Date.now(), name, icon, head, members: 0 });
  saveState();
  closeModal();
  renderOrg();
  showToast(`部门「${name}」创建成功！`, 'success');
}

function saveDept(i) {
  const name = document.getElementById('deptName').value.trim();
  const icon = document.querySelector('#modalContainer .industry-btn.active')?.dataset.icon || appState.departments[i].icon;
  const head = document.getElementById('deptHead').value.trim();
  if (!name) { showToast('请输入部门名称', 'error'); return; }
  appState.departments[i] = { ...appState.departments[i], name, icon, head: head || appState.departments[i].head };
  saveState();
  closeModal();
  renderOrg();
  showToast(`部门「${name}」已更新`, 'success');
}

function showDeleteConfirm(type, index) {
  const item = type === 'dept' ? appState.departments[index] : appState.agents[index];
  showModal(`
    <div class="modal-title">⚠️ 确认删除</div>
    <p class="confirm-text">确定要删除 <span class="confirm-name">${item.name || item.icon}</span> 吗？此操作不可撤销。</p>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" style="background:var(--accent-danger)" onclick="confirmDelete('${type}',${index})">确认删除</button>
    </div>`);
}

function confirmDelete(type, index) {
  if (type === 'dept') {
    const dept = appState.departments[index];
    const name = dept.name;
    // 将该部门下的所有 Agent 设为未分配
    appState.agents.forEach(a => { if (a.deptId === dept.id) a.deptId = null; });
    appState.departments.splice(index, 1);
    saveState();
    closeModal(); renderOrg();
    showToast(`部门「${name}」已删除，其员工已待岗`, 'info');
  } else if (type === 'agent') {
    const name = appState.agents[index].name;
    appState.agents.splice(index, 1);
    saveState();
    closeModal();
    if(window.renderAgents) renderAgents(); // 针对Agent管理页面
    renderOrg(); // 针对驾驶舱组织架构
    showToast(`员工「${name}」已被解雇`, 'info');
  }
}

// ---- Agent Connect Wizard ----
let wizardStep = 1;
let wizardData = {};

function showAgentWizard() {
  wizardStep = 1; wizardData = {};
  renderWizardStep();
}

function renderWizardStep() {
  const steps = [
    // Step 1: Select Platform
    () => `
      <div class="modal-title">🤖 接入新 Agent — 选择平台</div>
      <div class="wizard-steps"><span class="wizard-step active"></span><span class="wizard-step"></span><span class="wizard-step"></span><span class="wizard-step"></span></div>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px">选择 Agent 运行的 AI 平台</p>
      <div class="platform-grid">
        ${[
          { id:'openclaw', icon:'🦞', name:'OpenClaw' },
          { id:'hermes', icon:'⚡', name:'Hermes' },
          { id:'claude', icon:'🧠', name:'Claude' },
          { id:'gemini', icon:'💎', name:'Gemini' },
          { id:'chatgpt', icon:'🤖', name:'ChatGPT' },
          { id:'coze', icon:'🔮', name:'Coze Bot' }
        ].map(p => `<button class="platform-option" onclick="selectPlatform(this,'${p.id}')" data-platform="${p.id}"><span class="platform-icon">${p.icon}</span><span class="platform-name">${p.name}</span></button>`).join('')}
      </div>
      <div class="modal-actions"><button class="btn btn-secondary" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="wizardNext()">下一步 →</button></div>`,
    // Step 2: Configure
    () => `
      <div class="modal-title">🔧 配置连接 — ${wizardData.platformName}</div>
      <div class="wizard-steps"><span class="wizard-step completed"></span><span class="wizard-step active"></span><span class="wizard-step"></span><span class="wizard-step"></span></div>
      <div class="input-group"><label class="input-label">Agent 名称</label><input class="input" id="wizAgentName" placeholder="给你的 Agent 取个名字"></div>
      <div class="input-group"><label class="input-label">API Key / Token</label><input class="input" id="wizApiKey" type="password" placeholder="sk-xxxx 或 Bearer token" value="sk-demo-key-****"></div>
      <div class="input-group"><label class="input-label">分配部门</label>
        <select class="input" id="wizDept">${appState.departments.map((d,i)=>`<option value="${i}">${d.icon} ${d.name}</option>`).join('')}</select>
      </div>
      <div class="input-group"><label class="input-label">技能标签（逗号分隔）</label><input class="input" id="wizSkills" placeholder="例如：数据分析,报告撰写"></div>
      <div class="modal-actions"><button class="btn btn-secondary" onclick="wizardBack()">← 上一步</button><button class="btn btn-primary" onclick="wizardNext()">测试连接 →</button></div>`,
    // Step 3: Test Connection
    () => `
      <div class="modal-title">🔗 测试连接</div>
      <div class="wizard-steps"><span class="wizard-step completed"></span><span class="wizard-step completed"></span><span class="wizard-step active"></span><span class="wizard-step"></span></div>
      <div style="text-align:center;padding:30px 0" id="connTest">
        <div style="font-size:48px;margin-bottom:16px;animation:float 2s infinite">🔄</div>
        <p style="color:var(--text-secondary)">正在连接 ${wizardData.platformName}...</p>
      </div>
      <div class="modal-actions"><button class="btn btn-secondary" onclick="wizardBack()">← 上一步</button><button class="btn btn-primary" id="wizNextBtn" disabled>下一步 →</button></div>`,
    // Step 4: Done
    () => `
      <div class="modal-title">✅ Agent 接入成功！</div>
      <div class="wizard-steps"><span class="wizard-step completed"></span><span class="wizard-step completed"></span><span class="wizard-step completed"></span><span class="wizard-step active"></span></div>
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:64px;margin-bottom:16px">🎉</div>
        <h3 style="margin-bottom:8px">${wizardData.agentName || '新Agent'} 已上线</h3>
        <p style="font-size:13px;color:var(--text-muted)">平台: ${wizardData.platformName} · 部门: ${wizardData.dept}</p>
      </div>
      <div class="modal-actions"><button class="btn btn-primary" onclick="finishAgentWizard()">进入工作</button></div>`
  ];
  showModal(steps[wizardStep - 1]());
  if (wizardStep === 3) simulateConnection();
}

function selectPlatform(btn, id) {
  document.querySelectorAll('.platform-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  wizardData.platform = id;
  wizardData.platformName = btn.querySelector('.platform-name').textContent;
}

function wizardNext() {
  if (wizardStep === 1 && !wizardData.platform) { showToast('请选择一个平台', 'error'); return; }
  if (wizardStep === 2) {
    wizardData.agentName = document.getElementById('wizAgentName').value.trim() || 'Agent-' + Date.now();
    wizardData.deptIndex = document.getElementById('wizDept').value;
    wizardData.dept = document.getElementById('wizDept').options[document.getElementById('wizDept').selectedIndex].text;
    wizardData.skills = document.getElementById('wizSkills').value.split(',').map(s=>s.trim()).filter(Boolean);
  }
  wizardStep++;
  renderWizardStep();
}

function wizardBack() { wizardStep--; renderWizardStep(); }

function finishAgentWizard() {
  const deptIndex = wizardData.deptIndex;
  const deptId = (deptIndex !== undefined && appState.departments[deptIndex]) ? appState.departments[deptIndex].id : null;
  const newAgent = {
    id: 'a' + Date.now(),
    name: wizardData.agentName,
    role: wizardData.platformName + ' 助理',
    deptId: deptId,
    avatar: '🤖',
    color: '#6366f1',
    status: 'online',
    platform: wizardData.platformName,
    skills: wizardData.skills || ['智能处理'],
    tasks: { completed: 0, total: 0 },
    tokenUsage: 0,
    tokenBudget: 10
  };
  
  appState.agents.push(newAgent);
  saveState();
  closeModal();
  renderOrg();
  showToast(`Agent「${wizardData.agentName}」已加入工作！`, 'success');
}

function simulateConnection() {
  setTimeout(() => {
    const test = document.getElementById('connTest');
    if (test) {
      test.innerHTML = `<div style="font-size:48px;margin-bottom:16px">✅</div><p style="color:var(--accent-secondary);font-weight:600">连接成功！延迟 23ms</p><p style="font-size:12px;color:var(--text-muted);margin-top:8px">模型: ${wizardData.platformName} · 状态: 就绪</p>`;
    }
    const btn = document.getElementById('wizNextBtn');
    if (btn) { btn.disabled = false; btn.onclick = wizardNext; }
  }, 2000);
}

// ---- Modal System ----
function showModal(content) {
  let overlay = document.getElementById('modalContainer');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modalContainer';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal" id="modalBody"></div>';
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.body.appendChild(overlay);
  }
  document.getElementById('modalBody').innerHTML = content;
  requestAnimationFrame(() => overlay.classList.add('active'));
}

function closeModal() {
  const overlay = document.getElementById('modalContainer');
  if (overlay) { overlay.classList.remove('active'); setTimeout(() => overlay.remove(), 300); }
}
