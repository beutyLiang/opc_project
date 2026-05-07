/* ===================================================
   OPC OS — Mock Data (模拟数据)
   所有数据看起来要像真实的
   =================================================== */

const MOCK = {
  // 公司信息
  company: {
    name: '初序健康',
    industry: '大健康',
    foundDate: '2026-03-15',
    ceo: 'Zoey',
    template: '健康管家',
    description: '一人公司操作系统 · AI驱动的健康管理平台'
  },

  // Agent 列表
  agents: [
    {
      id: 'a1',
      name: '子默',
      role: 'AI 运营官',
      deptId: 'd1',
      avatar: '🧠',
      status: 'online',
      platform: 'Claude',
      tasks: { completed: 47, pending: 3, total: 50 },
      tokenUsage: 128500,
      tokenBudget: 200000,
      lastActive: '2 分钟前',
      skills: ['战略规划', '流程设计', '内容策略', '营销策略'],
      color: '#a855f7'
    },
    {
      id: 'a2',
      name: '恺撒',
      role: 'AI 技术官',
      deptId: 'd2',
      avatar: '⚡',
      status: 'online',
      platform: 'Gemini',
      tasks: { completed: 63, pending: 5, total: 68 },
      tokenUsage: 89200,
      tokenBudget: 150000,
      lastActive: '刚刚',
      skills: ['系统开发', '架构设计', '自动化', 'API集成'],
      color: '#6366f1'
    },
    {
      id: 'a3',
      name: '明哲',
      role: 'AI 文案官',
      deptId: 'd3',
      avatar: '✍️',
      status: 'online',
      platform: 'ChatGPT',
      tasks: { completed: 35, pending: 2, total: 37 },
      tokenUsage: 62400,
      tokenBudget: 100000,
      lastActive: '15 分钟前',
      skills: ['脚本文案', '科普内容', '营销文案', 'SEO优化'],
      color: '#ec4899'
    },
    {
      id: 'a4',
      name: '知远',
      role: 'AI 调研官',
      deptId: 'd4',
      avatar: '📊',
      status: 'online',
      platform: 'Gemini',
      tasks: { completed: 28, pending: 1, total: 29 },
      tokenUsage: 45800,
      tokenBudget: 80000,
      lastActive: '8 分钟前',
      skills: ['数据分析', '竞品调研', '市场研究', '复盘报告'],
      color: '#3b82f6'
    }
  ],

  // 部门
  departments: [
    { id: 'd1', name: '运营部', icon: '🎯', head: '子默', members: 1 },
    { id: 'd2', name: '技术部', icon: '⚡', head: '恺撒', members: 1 },
    { id: 'd3', name: '内容部', icon: '✍️', head: '明哲', members: 1 },
    { id: 'd4', name: '数据部', icon: '📊', head: '知远', members: 1 }
  ],

  // 驾驶舱统计（基于真实运营数据）
  stats: {
    activeAgents: 4,
    totalAgents: 4,
    tasksToday: 18,
    tasksCompleted: 14,
    pendingApprovals: 4,
    monthlyRevenue: 28600,
    lastMonthRevenue: 24200,
    monthlyCost: 2680,
    lastMonthCost: 2850,
    netProfit: 25920,
    activeUsers: 8472,
    lastMonthUsers: 7130,
    communityMembers: 5236,
    conversionRate: 30,
    avgSessionTime: '8.5 分钟',
    healthReports: 6847
  },

  // 营收趋势 (最近7天)
  revenueTrend: [
    { date: '4/16', revenue: 220, cost: 95 },
    { date: '4/17', revenue: 185, cost: 88 },
    { date: '4/18', revenue: 310, cost: 102 },
    { date: '4/19', revenue: 275, cost: 96 },
    { date: '4/20', revenue: 340, cost: 110 },
    { date: '4/21', revenue: 290, cost: 98 },
    { date: '4/22', revenue: 240, cost: 91 }
  ],

  // 任务列表
  tasks: [
    {
      id: 't1', title: '小红书养生内容排期(4月第4周)',
      assignee: '明哲', status: 'completed', priority: 'high',
      dept: '内容部', dueDate: '4/21', completedDate: '4/20'
    },
    {
      id: 't2', title: '春季养肝茶CPS选品分析',
      assignee: '知远', status: 'completed', priority: 'medium',
      dept: '数据部', dueDate: '4/20', completedDate: '4/20'
    },
    {
      id: 't3', title: 'AI客服体质问卷优化v3',
      assignee: '恺撒', status: 'in-progress', priority: 'high',
      dept: '技术部', dueDate: '4/23', completedDate: null
    },
    {
      id: 't4', title: '节气营销文案-谷雨专题',
      assignee: '明哲', status: 'in-progress', priority: 'medium',
      dept: '内容部', dueDate: '4/22', completedDate: null
    },
    {
      id: 't5', title: '社群运营SOP v2 制定',
      assignee: '子默', status: 'in-progress', priority: 'high',
      dept: '运营部', dueDate: '4/24', completedDate: null
    },
    {
      id: 't6', title: '健康商城首页UI迭代',
      assignee: '恺撒', status: 'review', priority: 'high',
      dept: '技术部', dueDate: '4/22', completedDate: null
    },
    {
      id: 't7', title: '竞品分析报告-Dify平台',
      assignee: '知远', status: 'todo', priority: 'low',
      dept: '数据部', dueDate: '4/28', completedDate: null
    },
    {
      id: 't8', title: '五一促销方案策划',
      assignee: '子默', status: 'todo', priority: 'medium',
      dept: '运营部', dueDate: '4/26', completedDate: null
    }
  ],

  // 财务数据
  finance: {
    monthly: [
      { month: '1月', revenue: 0, cost: 320, profit: -320 },
      { month: '2月', revenue: 0, cost: 450, profit: -450 },
      { month: '3月', revenue: 520, cost: 580, profit: -60 },
      { month: '4月', revenue: 1860, cost: 680, profit: 1180 }
    ],
    tokenUsage: [
      { agent: '子默', platform: 'Claude', used: 128500, budget: 200000, cost: 285 },
      { agent: '恺撒', platform: 'Gemini', used: 89200, budget: 150000, cost: 125 },
      { agent: '明哲', platform: 'ChatGPT', used: 62400, budget: 100000, cost: 168 },
      { agent: '知远', platform: 'Gemini', used: 45800, budget: 80000, cost: 64 }
    ],
    infrastructure: [
      { item: '云服务器', cost: 68, provider: '阿里云' },
      { item: '域名', cost: 10, provider: '腾讯云' },
      { item: 'CDN', cost: 15, provider: 'Cloudflare' }
    ]
  },

  // 商城商品
  products: [
    {
      id: 'p1', name: '五行养肝茶·春季限定', price: 68, originalPrice: 98,
      image: '🍵', tag: '节气推荐', sales: 127, commission: 30,
      bodyType: '木型体质', season: '春季',
      desc: '疏肝理气·菊花枸杞决明子配方'
    },
    {
      id: 'p2', name: '红枣桂圆养血茶', price: 49, originalPrice: 69,
      image: '🫖', tag: '热销TOP1', sales: 256, commission: 25,
      bodyType: '血虚体质', season: '四季',
      desc: '补血安神·古法慢焙工艺'
    },
    {
      id: 'p3', name: '薏米祛湿粉·即冲型', price: 39, originalPrice: 59,
      image: '🥣', tag: '回购率最高', sales: 189, commission: 20,
      bodyType: '湿热体质', season: '夏季',
      desc: '健脾祛湿·零添加纯磨粉'
    },
    {
      id: 'p4', name: '艾灸贴·肩颈专用', price: 29, originalPrice: 45,
      image: '🩹', tag: '新品', sales: 63, commission: 15,
      bodyType: '寒性体质', season: '四季',
      desc: '温经散寒·自发热8小时'
    },
    {
      id: 'p5', name: '节气养生礼盒·谷雨', price: 158, originalPrice: 228,
      image: '🎁', tag: '限量礼盒', sales: 34, commission: 60,
      bodyType: '全体质', season: '春季',
      desc: '春茶+花茶+养生糕点组合'
    },
    {
      id: 'p6', name: '山药薏仁粥料包', price: 35, originalPrice: 52,
      image: '🌾', tag: '食疗', sales: 142, commission: 18,
      bodyType: '脾虚体质', season: '四季',
      desc: '一袋一餐·5分钟慢煮'
    }
  ],

  // 社群数据（基于真实运营规模：5000+社群）
  communities: [
    { name: '初序·木型体质养肝群', members: 186, active: 142, type: '木型', created: '2/15' },
    { name: '初序·祛湿调理交流群', members: 220, active: 168, type: '土型', created: '1/20' },
    { name: '初序·VIP疗程跟踪群', members: 88, active: 76, type: 'VIP', created: '3/01' },
    { name: '初序·失眠调养互助群', members: 195, active: 153, type: '火型', created: '2/28' },
    { name: '初序·节气养生科普群', members: 312, active: 201, type: '科普', created: '1/10' },
    { name: '初序·补肾固元养生群', members: 167, active: 119, type: '水型', created: '3/15' }
  ],

  // 活动日志
  activityLog: [
    { time: '17:25', agent: 'AI 健康管家', action: '已完成用户王女士(ID:8829)的五行体质测评，打标[木型]。', type: 'task' },
    { time: '17:12', agent: 'AI 营养师', action: '已为用户张先生生成今日护肝食谱。', type: 'task' },
    { time: '16:58', agent: 'AI 销售', action: '成功命中[失眠关怀SOP]，已向刘女士发送安神茶购买链接，等待支付。', type: 'order' },
    { time: '16:45', agent: '系统', action: '监测到群活跃度下降，已自动生成一篇《初夏除烦饮》推文发送至社群。', type: 'doc' },
    { time: '16:30', agent: 'AI 健康管家', action: '已完成用户李先生(ID:8901)的五行体质测评，打标[水型]。', type: 'task' },
    { time: '16:15', agent: 'AI 营养师', action: '已为用户赵女士生成今日健脾食谱。', type: 'task' },
    { time: '15:48', agent: 'AI 销售', action: '成功命中[祛湿茶逼单策略]，向用户(ID:8422)发送优惠。', type: 'order' },
    { time: '15:20', agent: '系统', action: '更新了立夏节气自动关怀推送素材库', type: 'doc' }
  ],

  // 体质类型
  bodyTypes: [
    { type: '木型', element: '🌳', color: '#22c55e', traits: '肝气偏旺·易怒·目赤' },
    { type: '火型', element: '🔥', color: '#ef4444', traits: '心火旺盛·失眠·口舌' },
    { type: '土型', element: '🏔️', color: '#f59e0b', traits: '脾胃虚弱·腹胀·乏力' },
    { type: '金型', element: '⚡', color: '#94a3b8', traits: '肺气不足·干咳·皮肤' },
    { type: '水型', element: '💧', color: '#3b82f6', traits: '肾气亏虚·腰膝·耳鸣' }
  ],

  // 商业闭环飞轮（基于真实运营数据：日引流1万，月6万）
  funnel: [
    { step: '直播矩阵引流', icon: '📢', agent: 'AI内容官', platform: '抖音矩阵号',
      metric: '日引流 1万+', value: 10000, status: 'active',
      desc: '中医专家/营养师人设号矩阵，70%主播为品牌引流' },
    { step: 'AI 健康管家', icon: '🤖', agent: '健康管家Bot', platform: 'Coze+微信',
      metric: '月承接 6万粉', value: 60000, status: 'active',
      desc: '自动承接直播粉丝，3分钟完成体质测评+智能打标' },
    { step: '智能分层', icon: '🎯', agent: 'AI分诊员', platform: 'OPC OS',
      metric: '精准客户 1.8万', value: 18000, status: 'active',
      desc: 'AI自动判断客户价值等级，精准客/种子客分流入不同社群' },
    { step: '社群AI助教', icon: '👥', agent: 'AI社群运营', platform: '企微+Claude',
      metric: '5000+社群管理', value: 5000, status: 'active',
      desc: '早安打卡+节气食谱+健康科普，AI替代500人客服日常跟踪' },
    { step: '精准转化', icon: '🛒', agent: 'AI导购', platform: '健康商城',
      metric: '年转化率 30%', value: 30, status: 'active',
      desc: '基于体质画像推荐药食同源产品，客单价¥2880-10000' },
    { step: '复购裂变', icon: '🔄', agent: 'AI关怀官', platform: '协作',
      metric: '复购率 50%', value: 50, status: 'active',
      desc: '疗程提醒+换季重测+个性化复购推荐，LTV持续提升' }
  ],

  // 转化漏斗数据（基于真实运营规模）
  conversionFunnel: [
    { label: '月直播引流', value: 60000, color: '#6366f1' },
    { label: '进入AI测评', value: 42000, color: '#8b5cf6' },
    { label: '完成体质测评', value: 28500, color: '#a78bfa' },
    { label: '入群（重点服务）', value: 18000, color: '#06d6a0' },
    { label: '年化成交', value: 5400, color: '#f59e0b' },
    { label: '复购用户', value: 2700, color: '#ec4899' }
  ]
};

// 工具函数
function formatNumber(num) {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

function formatCurrency(num) {
  return '¥' + num.toLocaleString();
}

function getStatusText(status) {
  const map = {
    'online': '在线',
    'offline': '离线',
    'busy': '忙碌中'
  };
  return map[status] || status;
}

function getTaskStatusText(status) {
  const map = {
    'todo': '待办',
    'in-progress': '进行中',
    'review': '审核中',
    'completed': '已完成'
  };
  return map[status] || status;
}

function getTaskStatusClass(status) {
  const map = {
    'todo': 'badge-secondary',
    'in-progress': 'badge-primary',
    'review': 'badge-warning',
    'completed': 'badge-success'
  };
  return map[status] || '';
}

function getPriorityIcon(priority) {
  const map = {
    'high': '🔴',
    'medium': '🟡',
    'low': '🟢'
  };
  return map[priority] || '⚪';
}
