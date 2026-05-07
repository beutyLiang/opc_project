import re

html_path = r'C:\projects\openclaw\opc_project\frontend\shop.html'
js_path = r'C:\projects\openclaw\opc_project\frontend\shop.js'
css_path = r'C:\projects\openclaw\opc_project\frontend\shop.css'

# --- HTML Update ---
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Insert the category tabs right after the header
if 'id="category-tabs"' not in html:
    html = re.sub(
        r'(</header>)(\s*<!-- 推荐列表区 -->)',
        r'\1\n\n        <!-- 分类导航栏 -->\n        <nav class="category-tabs fade-in-up" id="category-tabs"></nav>\n\2',
        html
    )

# Add ID to ai-explanation
if 'id="ai-explanation-section"' not in html:
    html = html.replace('<div class="ai-explanation">', '<div class="ai-explanation" id="ai-explanation-section">')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# --- CSS Update ---
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

if 'category-tabs' not in css:
    css += '''

/* 分类导航栏 */
.category-tabs {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    padding: 10px 20px;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scroll-behavior: smooth;
}

.category-tabs::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
}

.tab-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    padding: 8px 16px;
    border-radius: 20px;
    margin-right: 12px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.tab-btn:last-child {
    margin-right: 0;
}

.tab-btn.active {
    background: var(--accent-color, #00d2ad);
    color: #000;
    border-color: var(--accent-color, #00d2ad);
    font-weight: 600;
    box-shadow: 0 0 10px rgba(0, 210, 173, 0.3);
}
'''
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)

# --- JS Rewrite ---
js_content = """// shop.js - 动态渲染商城逻辑 (多分类重构)

const SHOP_DATA = {
    // === 五行体质专属分类 ===
    wood: {
        id: 'wood',
        type: 'element',
        title: '木型体质 · 疏肝理气',
        tabName: '木·肝',
        color: '#2d6a4f',
        reason: '木型体质肝火偏旺，需要疏肝、养血、柔肝的食材来调理。春季尤其要注意情绪管理和肝脏养护。',
        products: [
            { name: '疏肝理气茶', desc: '玫瑰+佛手+陈皮 · 15袋装', price: 39.9, emoji: '🍵' },
            { name: '枸杞菊花养肝茶', desc: '杭白菊 宁夏枸杞 · 30包', price: 29.9, emoji: '🌼' },
            { name: '护肝食材组合包', desc: '菠菜+枸杞+山药干 · 周装', price: 49.9, emoji: '🥬' },
            { name: '安神助眠香薰', desc: '薰衣草 佛手柑精油 · 10ml', price: 59.0, emoji: '🕯️' }
        ]
    },
    fire: {
        id: 'fire',
        type: 'element',
        title: '火型体质 · 清心养神',
        tabName: '火·心',
        color: '#c9184a',
        reason: '火型体质心火偏旺，容易失眠、口干、心烦。需要清心降火、养阴安神的调理。',
        products: [
            { name: '莲子百合安神茶', desc: '莲子心 百合+酸枣仁 · 15袋', price: 35.9, emoji: '🍵' },
            { name: '酸枣仁助眠膏', desc: '古法熬制 · 150g/瓶', price: 68.0, emoji: '🍯' },
            { name: '苦瓜降火片', desc: '冻干苦瓜+菊花 · 30片', price: 25.9, emoji: '💊' },
            { name: '冰糖银耳即食羹', desc: '润燥养心 · 6罐装', price: 42.0, emoji: '🥣' }
        ]
    },
    earth: {
        id: 'earth',
        type: 'element',
        title: '土型体质 · 健脾祛湿',
        tabName: '土·脾',
        color: '#e6a817',
        reason: '土型体质脾胃运化能力偏弱，容易受湿气影响。需要健脾化湿、温补中气。',
        products: [
            { name: '四神汤料包', desc: '山药+莲子+芡实+茯苓 · 10包', price: 45.9, emoji: '🍲' },
            { name: '红豆薏米茶', desc: '炒薏米 赤小豆 · 30袋', price: 32.9, emoji: '🍵' },
            { name: '山药饼干（代餐）', desc: '铁棍山药 · 低糖配方', price: 28.0, emoji: '🍘' },
            { name: '艾灸贴（脾俞穴）', desc: '自发热艾叶贴 · 20片', price: 38.0, emoji: '🔥' }
        ]
    },
    metal: {
        id: 'metal',
        type: 'element',
        title: '金型体质 · 润肺养阴',
        tabName: '金·肺',
        color: '#6c757d',
        reason: '金型体质肺气偏弱，皮肤易干燥，秋冬容易咳嗽。需要润肺养阴、滋润呼吸道。',
        products: [
            { name: '川贝枇杷膏', desc: '古法熬制 · 老字号 · 200g', price: 58.0, emoji: '🍯' },
            { name: '雪梨银耳即食羹', desc: '润肺养颜 · 6罐装', price: 45.0, emoji: '🥣' },
            { name: '罗汉果菊花茶', desc: '清肺利咽 · 20袋装', price: 26.9, emoji: '🍵' },
            { name: '蜂蜜柚子茶', desc: '手工熬制 · 500g罐装', price: 39.9, emoji: '🍯' }
        ]
    },
    water: {
        id: 'water',
        type: 'element',
        title: '水型体质 · 温肾固本',
        tabName: '水·肾',
        color: '#1a237e',
        reason: '水型体质肾气不足，容易腰酸、怕冷、夜尿频。需要温肾壮阳、益精填髓。',
        products: [
            { name: '黑芝麻核桃丸', desc: '九蒸九晒 · 补肾乌发 · 200g', price: 55.0, emoji: '⚫' },
            { name: '杜仲枸杞养肾茶', desc: '杜仲+枸杞+桑葚 · 15袋', price: 42.9, emoji: '🍵' },
            { name: '艾灸贴（肾俞穴）', desc: '温肾散寒 · 20片装', price: 38.0, emoji: '🔥' },
            { name: '黑豆黑米组合', desc: '补肾粗粮 · 2kg装', price: 35.0, emoji: '🌾' }
        ]
    },
    
    // === 常规通用分类 ===
    daily_tea: {
        id: 'daily_tea',
        type: 'regular',
        title: '日常茶饮 · 平性温和',
        tabName: '日常茶饮',
        color: '#00d2ad',
        reason: '',
        products: [
            { name: '四季元气茶', desc: '人参 枸杞 红枣 · 30包', price: 49.9, emoji: '🫖' },
            { name: '桂圆红枣茶', desc: '温补气血 · 15包', price: 29.9, emoji: '🍎' },
            { name: '陈皮普洱茶', desc: '新会陈皮 熟普 · 散装100g', price: 88.0, emoji: '🍵' },
            { name: '茉莉花绿茶', desc: '清新解郁 · 20包', price: 25.0, emoji: '🌸' }
        ]
    },
    snacks: {
        id: 'snacks',
        type: 'regular',
        title: '健康零食 · 药食同源',
        tabName: '健康零食',
        color: '#f59e0b',
        reason: '',
        products: [
            { name: '无糖黑芝麻丸', desc: '黑发养发 独立包装 · 250g', price: 39.0, emoji: '🖤' },
            { name: '山楂六物膏', desc: '消食健脾 · 1瓶', price: 45.0, emoji: '🏺' },
            { name: '红豆芡实糕', desc: '健脾祛湿 饱腹 · 300g', price: 28.0, emoji: '🥮' },
            { name: '原味山药薄片', desc: '低卡烘焙 非油炸 · 5袋', price: 19.9, emoji: '🥔' }
        ]
    },
    equipments: {
        id: 'equipments',
        type: 'regular',
        title: '理疗器具 · 居家必备',
        tabName: '理疗器具',
        color: '#6366f1',
        reason: '',
        products: [
            { name: '便携智能艾灸盒', desc: '无烟过滤 温度可调', price: 198.0, emoji: '♨️' },
            { name: '天然牛角刮痧板', desc: '加厚款 附穴位图', price: 29.9, emoji: '🪒' },
            { name: '中药泡脚包', desc: '艾草 老姜 益母草 · 30包', price: 35.0, emoji: '🦶' },
            { name: '恒温加热腰带', desc: '暖宫护腰 三档温控', price: 128.0, emoji: '🛡️' }
        ]
    }
};

const CATEGORY_ORDER = ['user_element', 'wood', 'fire', 'earth', 'metal', 'water', 'daily_tea', 'snacks', 'equipments'];

document.addEventListener('DOMContentLoaded', () => {
    // 解析 URL 获取用户体质
    const urlParams = new URLSearchParams(window.location.search);
    let userElement = urlParams.get('element') || 'earth'; 
    if (!SHOP_DATA[userElement]) userElement = 'earth';

    let currentCategoryId = userElement;

    const tabsContainer = document.getElementById('category-tabs');
    const header = document.getElementById('shop-header');
    const titleEl = document.getElementById('element-title');
    const reasonEl = document.getElementById('element-reason');
    const reasonDetailEl = document.getElementById('element-reason-detail');
    const explanationSection = document.getElementById('ai-explanation-section');
    const productList = document.getElementById('product-list');

    // 渲染 Tab
    function renderTabs() {
        if (!tabsContainer) return;
        tabsContainer.innerHTML = '';
        
        CATEGORY_ORDER.forEach(catId => {
            let actualId = catId;
            let tabLabel = '';
            
            if (catId === 'user_element') {
                actualId = userElement;
                tabLabel = '⭐ 专属推荐';
            } else {
                if (catId === userElement) return; // 已经在专属里了，不重复展示
                tabLabel = SHOP_DATA[catId].tabName;
            }

            const btn = document.createElement('button');
            btn.className = `tab-btn ${currentCategoryId === actualId ? 'active' : ''}`;
            btn.textContent = tabLabel;
            btn.onclick = () => {
                if (currentCategoryId !== actualId) {
                    currentCategoryId = actualId;
                    renderTabs();
                    renderCategory(actualId);
                }
            };
            tabsContainer.appendChild(btn);
        });
        
        // 滚动到当前选中的 tab (简单居中处理)
        const activeTab = tabsContainer.querySelector('.active');
        if (activeTab) {
            // setTimeout ensuring layout is calculated
            setTimeout(() => {
                tabsContainer.scrollTo({
                    left: activeTab.offsetLeft - tabsContainer.offsetWidth / 2 + activeTab.offsetWidth / 2,
                    behavior: 'smooth'
                });
            }, 50);
        }
    }

    // 渲染选中分类的内容
    function renderCategory(categoryId) {
        const data = SHOP_DATA[categoryId];
        
        // 更新头部
        header.style.background = `linear-gradient(135deg, ${data.color}E6 0%, ${data.color}00 100%)`;
        titleEl.textContent = data.title;
        
        // 淡入动画重置
        productList.classList.remove('fade-in');
        void productList.offsetWidth; // 触发重绘
        productList.classList.add('fade-in');

        if (data.type === 'element') {
            reasonEl.textContent = data.reason;
            reasonDetailEl.textContent = `由于${data.reason}`;
            explanationSection.style.display = 'block';
        } else {
            reasonEl.textContent = '通用调养系列，适合全家共享';
            explanationSection.style.display = 'none';
        }

        // 渲染商品
        productList.innerHTML = '';
        data.products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-emoji">${product.emoji}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-desc">${product.desc}</div>
                <div class="product-price">¥${product.price.toFixed(1)}</div>
                <button class="buy-btn" onclick="openPurchaseModal()">立即购买</button>
            `;
            productList.appendChild(card);
        });
    }

    // 弹窗逻辑
    const modal = document.getElementById('purchase-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    if (modal) modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.style.display = 'none';
    });

    // 初始化
    renderTabs();
    renderCategory(currentCategoryId);
});

function openPurchaseModal() {
    const modal = document.getElementById('purchase-modal');
    if(modal) modal.style.display = 'flex';
}
"""
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Shop refactoring completed successfully.")
