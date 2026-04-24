// OPC OS — Main Application Logic
// Part 1: Router, Onboarding, Toast, Core Utils

// ===== SPA Router =====
let _pageAutoRefreshTimer = null;
let _currentPage = null;

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) { target.classList.add('active'); }
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  // 清除上一页的自动刷新
  if (_pageAutoRefreshTimer) { clearInterval(_pageAutoRefreshTimer); _pageAutoRefreshTimer = null; }
  _currentPage = page;

  // Render page content
  if (pageRenderers[page]) pageRenderers[page]();

  // 组织架构页和驾驶舱：启动自动局部刷新（模拟系统活跃感）
  if (page === 'org' || page === 'dashboard') {
    _pageAutoRefreshTimer = setInterval(() => {
      if (_currentPage !== page) return; // 安全检查
      // 仅进行局部 DOM 更新，不调用 pageRenderers 以免破坏交互和动画
      _tickAgentActivity();  
    }, 5000); // 每 5 秒刷新一次
  }
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3800);
}

// ===== Animated Counter =====
function animateCount(el, target, duration = 1200) {
  let start = 0; const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    if (target >= 1000) el.textContent = Math.floor(start).toLocaleString();
    else if (target % 1 !== 0) el.textContent = start.toFixed(1);
    else el.textContent = Math.floor(start);
  }, 16);
}

// ===== Onboarding =====
function nextStep(step) {
  document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('step' + step);
  if (target) target.classList.add('active');
  if (step === 4) runAgentLoading();
}

function runAgentLoading() {
  const list = document.getElementById('agentLoadingList');
  const progress = document.getElementById('loadingProgress');
  const text = document.getElementById('loadingText');
  const agents = MOCK.agents;
  list.innerHTML = agents.map(a => `
    <div class="agent-load-item" id="load-${a.id}">
      <span class="agent-load-avatar">${a.avatar}</span>
      <div class="agent-load-info">
        <div class="agent-load-name">${a.name} · ${a.role}</div>
        <div class="agent-load-status">等待连接...</div>
      </div>
      <span class="agent-load-check">⏳</span>
    </div>
  `).join('');

  let i = 0;
  const msgs = ['正在配置 Agent 环境...', '连接 AI 模型中...', '加载技能模块...', '初始化完成！'];
  const interval = setInterval(() => {
    if (i < agents.length) {
      const item = document.getElementById('load-' + agents[i].id);
      if (item) {
        item.querySelector('.agent-load-status').textContent = '已连接 · ' + agents[i].platform;
        item.querySelector('.agent-load-check').textContent = '✅';
        item.classList.add('connected');
      }
      progress.style.width = ((i + 1) / agents.length * 100) + '%';
      text.textContent = msgs[Math.min(i, msgs.length - 1)];
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        document.getElementById('onboardingOverlay').style.opacity = '0';
        setTimeout(() => {
          document.getElementById('onboardingOverlay').style.display = 'none';
          document.getElementById('appContainer').style.display = 'flex';
          initApp();
        }, 500);
      }, 800);
    }
  }, 700);
}

// ===== Init App =====
function initApp() {
  document.getElementById('dashboardDate').textContent = new Date().toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric', weekday:'long' });
  const name = document.getElementById('ceoName')?.value || 'Zoey';
  document.getElementById('sidebarUserName').textContent = name;
  saveState(); // Ensure state is saved immediately after onboarding
  renderDashboard();
  showToast('欢迎回来，' + name + '！系统已就绪', 'success');
}

// ===== Check if returning user =====
window.addEventListener('DOMContentLoaded', () => {
  // 检查是否已经存在保存的数据，如果有则直接跳过向导
  if (localStorage.getItem('opc_appState')) {
    const overlay = document.getElementById('onboardingOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    const container = document.getElementById('appContainer');
    if (container) {
      container.style.display = 'flex';
    }
    // 延迟一点初始化防止DOM还没完全准备好
    setTimeout(initApp, 100);
  }

  // Industry select buttons
  document.querySelectorAll('.industry-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.industry-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  // Template cards
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.querySelector('.coming-soon-badge')) return;
      document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
});

function resetAppData() {
  if (confirm('确定要重置所有数据吗？这将会清空你的修改并重新加载初始的测试数据。')) {
    localStorage.removeItem('opc_appState');
    location.reload();
  }
}
// 绑定重置按钮（兼容 inline onclick 失效的情况）
document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.getElementById('resetDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetAppData();
    });
  }
});

const pageRenderers = {
  dashboard: renderDashboard,
  org: renderOrg,
  tasks: renderTasks,
  agents: renderAgents,
  userops: renderUserOps,
  marketing: renderMarketing,
  community: renderCommunity,
  finance: renderFinance,
  cpreview: renderCPreview
};
