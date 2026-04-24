// 初序健康 C端 — 核心逻辑

// ===== 共享数据桥接 =====
const SHARED_KEY = 'opc_shared_data';
function getShared() { return JSON.parse(localStorage.getItem(SHARED_KEY) || '{"users":[],"assessmentCount":347,"todayNewUsers":12,"referralCount":34,"orders":[]}'); }
function setShared(d) { localStorage.setItem(SHARED_KEY, JSON.stringify(d)); }

// ===== 路由 =====
function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  // Tab bar highlight
  document.querySelectorAll('.tab-item').forEach((t, i) => {
    const map = ['home','assess','mall','profile'];
    t.classList.toggle('active', map[i] === page);
  });
  // Init page
  if (page === 'assess') initAssessment();
  if (page === 'mall') renderMall();
  if (page === 'profile') renderProfile();
}

// ===== Toast =====
function showToast(msg) {
  const w = document.getElementById('toastWrap');
  w.innerHTML = `<div class="toast">${msg}</div>`;
  setTimeout(() => w.innerHTML = '', 2500);
}

// ===== 测评数据 =====
const questions = [
  { q: '你更容易出现哪种情绪状态？', opts: [
    { icon:'😤', text:'焦虑易怒、急躁', type:'wood' },
    { icon:'😰', text:'兴奋难静、心慌', type:'fire' },
    { icon:'😟', text:'多虑多思、担忧', type:'earth' },
    { icon:'😢', text:'情绪低落、敏感', type:'metal' },
  ]},
  { q: '你的睡眠状况如何？', opts: [
    { icon:'🌙', text:'多梦易醒、睡不安稳', type:'wood' },
    { icon:'🔥', text:'入睡困难、烦热', type:'fire' },
    { icon:'😴', text:'嗜睡沉重、醒后仍困', type:'earth' },
    { icon:'💦', text:'夜间盗汗、早醒', type:'water' },
  ]},
  { q: '饮食方面，你有什么偏好或困扰？', opts: [
    { icon:'🍋', text:'喜酸、口苦、胁肋胀', type:'wood' },
    { icon:'🌶️', text:'怕热、口渴、喜冷饮', type:'fire' },
    { icon:'🍚', text:'食欲差、腹胀、消化慢', type:'earth' },
    { icon:'🍐', text:'口干、喉痒、干咳', type:'metal' },
  ]},
  { q: '身体方面最困扰你的是？', opts: [
    { icon:'👀', text:'眼睛干涩、视物模糊', type:'wood' },
    { icon:'💓', text:'心悸、胸闷、面红', type:'fire' },
    { icon:'🦵', text:'四肢沉重、水肿', type:'earth' },
    { icon:'🦴', text:'腰膝酸软、怕冷', type:'water' },
  ]},
  { q: '你的精力状态如何？', opts: [
    { icon:'⚡', text:'时好时差、情绪影响大', type:'wood' },
    { icon:'🔋', text:'白天亢奋、容易疲劳', type:'fire' },
    { icon:'🐢', text:'整体偏低、懒动', type:'earth' },
    { icon:'❄️', text:'怕冷、手脚凉、低沉', type:'water' },
  ]},
];

const bodyTypes = {
  wood:  { name:'木型体质', icon:'🌿', element:'木', organ:'肝', color:'#059669',
           desc:'肝气偏旺，春季尤需疏肝理气。易出现眼干、急躁、胁痛等症状。',
           advice: [
             { icon:'🍵', title:'饮食', text:'菊花枸杞茶、绿叶蔬菜' },
             { icon:'😌', title:'情绪', text:'避免暴怒，练习深呼吸' },
             { icon:'🧘', title:'运动', text:'太极、散步、八段锦' },
             { icon:'🌙', title:'作息', text:'23点前入睡，养肝血' },
           ],
           products: [
             { img:'🍵', name:'五行养肝茶', price:39.9 },
             { img:'🫐', name:'枸杞原浆', price:68 },
             { img:'🥗', name:'春季养肝食谱', price:0 },
           ]},
  fire:  { name:'火型体质', icon:'🔥', organ:'心', color:'#ef4444',
           desc:'心火偏旺，夏季需清心安神。易出现心悸、失眠、口舌生疮。',
           advice: [
             { icon:'🍉', title:'饮食', text:'莲子心茶、苦瓜、西瓜' },
             { icon:'🧘', title:'情绪', text:'冥想静心，减少刺激' },
             { icon:'🏊', title:'运动', text:'游泳、慢跑、避免剧烈' },
             { icon:'💤', title:'作息', text:'午休15分钟，养心气' },
           ],
           products: [
             { img:'🍵', name:'清心莲子茶', price:35.9 },
             { img:'🫖', name:'安神助眠香囊', price:29.9 },
             { img:'📖', name:'夏季清心食谱', price:0 },
           ]},
  earth: { name:'土型体质', icon:'🌾', organ:'脾', color:'#f59e0b',
           desc:'脾胃虚弱，易水湿内停。常见食欲不振、腹胀、四肢沉重。',
           advice: [
             { icon:'🥣', title:'饮食', text:'山药薏米粥、少食生冷' },
             { icon:'🙂', title:'情绪', text:'减少忧思，保持乐观' },
             { icon:'🚶', title:'运动', text:'饭后散步、揉腹' },
             { icon:'⏰', title:'作息', text:'规律三餐，细嚼慢咽' },
           ],
           products: [
             { img:'🥣', name:'山药薏米粉', price:29.9 },
             { img:'🍯', name:'健脾养胃蜂蜜', price:45 },
             { img:'📖', name:'脾胃调养食谱', price:0 },
           ]},
  metal: { name:'金型体质', icon:'🌬️', organ:'肺', color:'#6366f1',
           desc:'肺气不足，易受燥邪侵袭。常见干咳、皮肤干、情绪低落。',
           advice: [
             { icon:'🍐', title:'饮食', text:'雪梨银耳羹、百合' },
             { icon:'😊', title:'情绪', text:'避免悲伤，多晒太阳' },
             { icon:'🫁', title:'运动', text:'呼吸操、有氧慢跑' },
             { icon:'💧', title:'作息', text:'注意保湿，多饮温水' },
           ],
           products: [
             { img:'🍐', name:'润肺雪梨膏', price:42 },
             { img:'🌸', name:'百合银耳羹', price:36 },
             { img:'📖', name:'秋季润肺食谱', price:0 },
           ]},
  water: { name:'水型体质', icon:'💧', organ:'肾', color:'#3b82f6',
           desc:'肾气虚弱，阳气不足。常见腰膝酸软、怕冷、夜尿频繁。',
           advice: [
             { icon:'🥜', title:'饮食', text:'黑芝麻、核桃、羊肉汤' },
             { icon:'🔥', title:'情绪', text:'增强信心，避免恐惧' },
             { icon:'💪', title:'运动', text:'站桩、慢跑、避寒冷' },
             { icon:'🛏️', title:'作息', text:'早睡晚起，保暖腰腹' },
           ],
           products: [
             { img:'🥜', name:'黑芝麻核桃丸', price:38 },
             { img:'🍖', name:'温阳羊肉汤料', price:29.9 },
             { img:'📖', name:'冬季温阳食谱', price:0 },
           ]},
};

let currentQ = 0;
let answers = {};
let userBodyType = localStorage.getItem('user_body_type') || null;

function initAssessment() {
  currentQ = 0;
  answers = { wood:0, fire:0, earth:0, metal:0, water:0 };
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentQ];
  document.getElementById('assessProgress').textContent = `${currentQ+1}/5`;
  document.getElementById('assessBar').style.width = `${(currentQ+1)*20}%`;
  document.getElementById('assessBody').innerHTML = `
    <div class="question-text">${q.q}</div>
    <div class="option-grid">${q.opts.map((o, i) => `
      <div class="option-card" onclick="selectOption(${i},'${o.type}')">
        <span class="option-icon">${o.icon}</span>
        <span>${o.text}</span>
      </div>`).join('')}
    </div>`;
}

function selectOption(idx, type) {
  const cards = document.querySelectorAll('.option-card');
  cards.forEach(c => c.classList.remove('selected'));
  cards[idx].classList.add('selected');
  answers[type]++;

  setTimeout(() => {
    currentQ++;
    if (currentQ < 5) {
      renderQuestion();
    } else {
      finishAssessment();
    }
  }, 400);
}

function finishAssessment() {
  goTo('analyzing');
  // Determine body type
  let maxType = 'wood', maxScore = 0;
  for (const [t, s] of Object.entries(answers)) {
    if (s > maxScore) { maxScore = s; maxType = t; }
  }
  userBodyType = maxType;
  localStorage.setItem('user_body_type', maxType);

  // Write to shared data
  const shared = getShared();
  shared.assessmentCount = (shared.assessmentCount || 347) + 1;
  shared.todayNewUsers = (shared.todayNewUsers || 12) + 1;
  const uid = 'u' + Date.now();
  const names = ['小雨','阿文','小慧','大伟','晓晓','明月'];
  shared.users = shared.users || [];
  shared.users.unshift({
    id: uid, nickname: names[Math.floor(Math.random()*names.length)],
    bodyType: bodyTypes[maxType].name, channel: '小红书',
    tags: ['已测评'], assessmentDate: new Date().toISOString().slice(0,10)
  });
  setShared(shared);

  setTimeout(() => {
    goTo('report');
    renderReport(maxType);
  }, 2500);
}

function renderReport(type) {
  const bt = bodyTypes[type];
  document.getElementById('reportBody').innerHTML = `
    <div class="report-type-card">
      <div class="report-type-icon">${bt.icon}</div>
      <div class="report-type-name">${bt.name}</div>
      <div class="report-type-desc">${bt.organ}系为主 · ${bt.desc.slice(0,15)}…</div>
    </div>
    <div class="report-section">
      <h3>📖 体质解读</h3>
      <p style="color:#475569;font-size:14px;line-height:1.8">${bt.desc}</p>
    </div>
    <div class="report-section">
      <h3>💡 调养建议</h3>
      <div class="advice-grid">${bt.advice.map(a => `
        <div class="advice-item">
          <div class="adv-icon">${a.icon}</div>
          <div class="adv-title">${a.title}</div>
          <div class="adv-text">${a.text}</div>
        </div>`).join('')}
      </div>
    </div>
    <div class="report-section">
      <h3>🛒 推荐产品</h3>
      <div class="report-products">${bt.products.map(p => `
        <div class="report-product">
          <div class="rp-img">${p.img}</div>
          <div class="rp-name">${p.name}</div>
          <div class="rp-price">${p.price > 0 ? '¥'+p.price : '免费'}</div>
        </div>`).join('')}
      </div>
    </div>
    <div class="report-actions">
      <button class="btn-primary" onclick="goTo('mall')">查看推荐产品</button>
      <button class="btn-outline" onclick="goTo('share')">分享给好友</button>
    </div>`;
}

// ===== 商城 =====
const allProducts = [
  { img:'🍵', name:'五行养肝茶', price:39.9, orig:68, tag:'节气推荐', bodyType:'wood', sales:234 },
  { img:'🫐', name:'枸杞原浆', price:68, orig:98, tag:'热销', bodyType:'wood', sales:189 },
  { img:'🥣', name:'山药薏米粉', price:29.9, orig:49, tag:'热销', bodyType:'earth', sales:312 },
  { img:'🍐', name:'润肺雪梨膏', price:42, orig:68, tag:'节气推荐', bodyType:'metal', sales:156 },
  { img:'🥜', name:'黑芝麻核桃丸', price:38, orig:58, tag:'新品', bodyType:'water', sales:87 },
  { img:'🍯', name:'健脾养胃蜂蜜', price:45, orig:78, tag:'热销', bodyType:'earth', sales:201 },
  { img:'🌸', name:'百合银耳羹', price:36, orig:56, tag:'节气推荐', bodyType:'metal', sales:143 },
  { img:'🍖', name:'温阳羊肉汤料', price:29.9, orig:45, tag:'新品', bodyType:'water', sales:98 },
];

function renderMall(filter) {
  let items = allProducts;
  if (filter === '适合我' && userBodyType) {
    items = allProducts.filter(p => p.bodyType === userBodyType);
  } else if (filter === '节气推荐') {
    items = allProducts.filter(p => p.tag === '节气推荐');
  }
  document.getElementById('mallGrid').innerHTML = items.map(p => `
    <div class="mall-item" onclick="buyProduct('${p.name}',${p.price})">
      <div class="mall-img">${p.img}</div>
      <div class="mall-info">
        <div class="mall-name">${p.name}</div>
        <div class="mall-tag">适合${bodyTypes[p.bodyType]?.name || '多种体质'}</div>
        <div><span class="mall-price">¥${p.price}</span><span class="mall-price-old">¥${p.orig}</span></div>
      </div>
    </div>`).join('');
}

function filterMall(btn, tag) {
  document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMall(tag === 'all' ? null : tag);
}

function buyProduct(name, price) {
  showToast(`✅ 已购买「${name}」¥${price}`);
  const shared = getShared();
  shared.orders = shared.orders || [];
  shared.orders.push({ name, price, date: new Date().toISOString().slice(0,10) });
  setShared(shared);
}

// ===== 个人中心 =====
function renderProfile() {
  if (userBodyType) {
    const bt = bodyTypes[userBodyType];
    document.getElementById('profileAvatar').textContent = bt.icon;
    document.getElementById('profileName').textContent = '健康达人';
    document.getElementById('profileType').textContent = bt.name;
  }
}

// ===== 分享裂变 =====
function doShare() {
  const shared = getShared();
  shared.referralCount = (shared.referralCount || 34) + 1;
  setShared(shared);
  showToast('🎁 邀请链接已复制！分享给好友即可');
  document.getElementById('shareStats').textContent =
    `已邀请 ${shared.referralCount - 34} 人 · 获得 ¥${(shared.referralCount - 34) * 5} 优惠`;
}

// ===== 聊天 =====
let chatOpen = false;
const chatReplies = [
  '了解你的情况！建议你先做个体质测评，3分钟就能知道最适合你的养生方案。点下方底部导航栏的「测评」就可以开始～',
  '根据中医五行理论，不同体质适合不同的调养方式。测评完成后我可以给你更精准的建议！',
  '谷雨时节，建议多吃绿叶蔬菜、少食辛辣。如果你是木型体质，养肝茶是很好的选择哦～',
  '你可以在商城里找到适合你体质的产品，都是我们精选的养生好物！'
];
let replyIdx = 0;

function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatPanel').classList.toggle('open', chatOpen);
  document.getElementById('chatBubble').style.display = chatOpen ? 'none' : 'flex';
}

function sendChatMsg() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  const body = document.getElementById('chatMessages');
  body.innerHTML += `<div class="chat-msg user">${text}</div>`;
  input.value = '';
  body.scrollTop = body.scrollHeight;
  setTimeout(() => {
    body.innerHTML += `<div class="chat-msg bot">${chatReplies[replyIdx % chatReplies.length]}</div>`;
    body.scrollTop = body.scrollHeight;
    replyIdx++;
  }, 800);
}

// ===== 主动触发 =====
setTimeout(() => {
  const bubble = document.getElementById('chatBubble');
  if (bubble && !chatOpen) {
    bubble.style.animation = 'none';
    bubble.innerHTML = '💚<span style="position:absolute;top:-4px;right:-4px;background:#ef4444;color:#fff;border-radius:50%;width:18px;height:18px;font-size:11px;display:flex;align-items:center;justify-content:center">1</span>';
  }
}, 5000);

// ===== 初始化 =====
renderMall();
renderProfile();
