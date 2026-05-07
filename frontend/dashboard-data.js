/* ─── OPC Dashboard Data ─── */

// 组织架构节点
const ORG_NODES = [
    { id: 'zoey',    emoji: '🧠', name: 'Zoey',   role: 'CEO · 决策中枢',  color: '#00d2ad', isCenter: true },
    { id: 'bot',     emoji: '🌿', name: '初序Bot', role: '首席健康顾问',    color: '#4ecdc4' },
    { id: 'zimo',    emoji: '⚡', name: '子默',    role: 'COO/CTO · 战略',  color: '#7c5cbf' },
    { id: 'caesar',  emoji: '🔧', name: '凯撒',    role: '全栈工程师',      color: '#f39c12' },
    { id: 'mingzhe', emoji: '✍️', name: '明哲',    role: 'CMO · 内容',      color: '#e74c3c' },
    { id: 'zhiyuan', emoji: '🔍', name: '知远',    role: 'CRO · 调研',      color: '#3498db' },
];

// 经营指标
const METRICS = [
    { icon: '💰', label: '降本倍率',     value: '100x', desc: '月成本 ¥500 vs ¥50,000',   color: '#00d2ad' },
    { icon: '⚡', label: 'MVP 速度',     value: '2 周',  desc: '从零到可用 Demo',          color: '#f9d423' },
    { icon: '📊', label: '日代码产出',   value: '467行', desc: '每 Agent 每天',             color: '#7c5cbf' },
    { icon: '🌙', label: '服务能力',     value: '7×24',  desc: '全天候不间断',              color: '#4ecdc4' },
];

// 真实经营数据（子默月度更新到 business-data.json，初期硬编码）
const BUSINESS_DATA = {
    monthlyRevenue: 0,
    monthlyCost: 500,
    totalUsers: 0,
    paidReports: 0,
    cpsIncome: 0,
    lastUpdated: '2026-04-15'
};

// 商业闭环漏斗
const FUNNEL_DATA = [
    {
        icon: '🎯', title: '获客渠道',
        items: ['小红书', '抖音', '微信(观望)']
    },
    {
        icon: '🌿', title: '核心服务',
        items: ['初序Bot', '体质测评', '饮食推荐']
    },
    {
        icon: '💰', title: '变现路径',
        items: ['CPS佣金', '付费报告', '中医引流']
    }
];

// 变现管道状态
const REVENUE_PIPES = [
    { name: 'CPS 外卖佣金',  price: '¥1-3/单',   status: 'active',   note: '已接入，待获客' },
    { name: '付费体质报告',   price: '¥9.9',       status: 'building', note: '开发中' },
    { name: '七天行动单',     price: '¥29.9',      status: 'building', note: '开发中' },
    { name: '中医诊所引流',   price: '¥30-50/单',  status: 'planned',  note: '需线下对接' },
    { name: '企业定制方案',   price: '¥500-2000',  status: 'future',   note: 'Phase 3' },
];

// 协作日志备份（timeline-data.json 加载失败时 fallback）
const TIMELINE_FALLBACK = [
    { time: '04-09 22:01', sender: '凯撒',  color: '#f39c12', text: '收到，评估 OpenClaw 可行性...' },
    { time: '04-10 02:00', sender: '子默',  color: '#7c5cbf', text: 'Zoey批准48小时Spike+硬止损' },
    { time: '04-10 11:04', sender: '子默',  color: '#7c5cbf', text: '立刻停止V模型，回到Spike任务！' },
    { time: '04-10 11:18', sender: '凯撒',  color: '#f39c12', text: '收到确认！全力执行48小时Spike' },
    { time: '04-12 10:10', sender: '凯撒',  color: '#f39c12', text: 'Spike 链路已全部跑通 ✅' },
    { time: '04-12 12:00', sender: '子默',  color: '#7c5cbf', text: 'Spike 审核通过，合并主线' },
    { time: '04-13 22:25', sender: '子默',  color: '#7c5cbf', text: 'OPC调研报告+改造方案发出' },
    { time: '04-13 22:58', sender: '凯撒',  color: '#f39c12', text: '独立验证完成，子默判断正确' },
    { time: '04-14 14:58', sender: '凯撒',  color: '#f39c12', text: '蓝图v0.2审核完成，7+5项意见' },
    { time: '04-14 15:23', sender: '子默',  color: '#7c5cbf', text: '全部采纳，v0.3已出' },
];

// ─── 新增：财务维度扩展数据 ───

// AI 经营洞察 (Actionable Insights)
const AI_FINANCE_INSIGHTS = {
    title: "AI 经营参谋结论",
    icon: "💡",
    insights: [
        "发现异常：【失眠焦虑类人群】本月销售额环比下降20%，但【安神理疗设备】退货率为0。建议本周让智能客服向该标签池定向推送【酸枣仁安神饮】的满减券以提升连带率。",
        "机会洞察：买了【恒温腰带】的女性用户，有60%会顺手买【红枣黑糖】。建议明天在商城顶部上线【经期无忧组合套装】。"
    ]
};

// 货维度：产品分类财务分析
const PRODUCT_CATEGORY_DATA = [
    { category: '茶饮冲泡类',   revenue: 12500, mom: '+15%', yoy: '+40%', maxRev: 20000, color: '#f9d423', crossSell: '保温杯 (关联购买45%)' },
    { category: '理疗设备类',   revenue: 18000, mom: '-5%',  yoy: '+20%', maxRev: 20000, color: '#00d2ad', crossSell: '精油/艾草包 (关联购买60%)' },
    { category: '滋补膏方类',   revenue: 8500,  mom: '+30%', yoy: '+50%', maxRev: 20000, color: '#7c5cbf', crossSell: '木勺/炖盅 (关联购买15%)' },
    { category: '周边器皿类',   revenue: 3200,  mom: '+5%',  yoy: '-10%', maxRev: 20000, color: '#4ecdc4', crossSell: '茶饮冲泡类 (关联购买80%)' },
];

// 人维度：用户健康画像财务分析
const USER_PROFILE_DATA = [
    { profile: '肠胃不适/脾虚湿重', revenue: 15000, mom: '+40%', yoy: '+60%', repurchase: '72%', maxRev: 18000, color: '#f39c12' },
    { profile: '女性经期/内分泌',   revenue: 11000, mom: '+10%', yoy: '+25%', repurchase: '85%', maxRev: 18000, color: '#e74c3c' },
    { profile: '三高慢病类',        revenue: 9500,  mom: '+5%',  yoy: '+15%', repurchase: '90%', maxRev: 18000, color: '#3498db' },
    { profile: '睡眠障碍/焦虑',     revenue: 6700,  mom: '-20%', yoy: '-5%',  repurchase: '45%', maxRev: 18000, color: '#9b59b6' },
];
