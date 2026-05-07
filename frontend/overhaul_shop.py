import re

html_path = r'C:\projects\openclaw\opc_project\frontend\shop.html'
js_path = r'C:\projects\openclaw\opc_project\frontend\shop.js'
css_path = r'C:\projects\openclaw\opc_project\frontend\shop.css'

# --- HTML Overhaul ---
html_content = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>初序 · 定制调养商城</title>
    <meta name="theme-color" content="#1a1a1a">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Serif+SC:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="shop.css">
</head>
<body>
    <div id="shop-app" class="shop-container">
        <!-- 顶部区域：体质信息展示 -->
        <header id="shop-header" class="shop-header">
            <div class="header-nav">
                <a href="javascript:history.back()" class="back-btn">← 返回</a>
                <span class="logo">🌿 初序调养商城</span>
                <span class="cart-icon">🛒<span class="cart-badge">0</span></span>
            </div>
            <div class="element-info fade-in-up">
                <h1 id="element-title">--型体质 · --</h1>
                <p id="element-reason">加载中...</p>
            </div>
        </header>

        <!-- 搜索与筛选区 -->
        <div class="shop-controls fade-in-up">
            <div class="search-container">
                <div class="search-bar">
                    <span class="search-icon">🔍</span>
                    <input type="text" placeholder="搜索你需要的调养好物..." disabled>
                </div>
            </div>
            
            <!-- 分类导航栏 -->
            <nav class="category-tabs" id="category-tabs"></nav>
            
            <!-- 排序与筛选 -->
            <div class="filter-bar" id="filter-bar">
                <span class="filter-item active" data-sort="default">综合推荐</span>
                <span class="filter-item" data-sort="sales">销量优先</span>
                <span class="filter-item" data-sort="price">价格 <span class="sort-arrow">↕</span></span>
                <span class="filter-item" data-sort="new">新品上架</span>
            </div>
        </div>

        <!-- 推荐列表区 -->
        <main class="shop-main">
            <!-- 解释模块 -->
            <div class="ai-explanation" id="ai-explanation-section">
                <h3>💡 AI 定制推荐</h3>
                <p id="element-reason-detail">AI 根据你的体质个性化推荐</p>
            </div>

            <div id="product-list" class="product-grid fade-in">
                <!-- 商品卡片动态插入 -->
            </div>
            
            <div class="bottom-loading">没有更多商品了~</div>
        </main>
    </div>

    <!-- 弹窗 -->
    <div id="purchase-modal" class="modal-overlay" style="display:none;">
        <div class="modal-card">
            <div class="modal-icon">🛍️</div>
            <h3>添加专属客服</h3>
            <p>获取详细商品说明与专属优惠，完成购买。</p>
            <div class="qr-placeholder">
                <span>[ 客服微信二维码 ]</span>
            </div>
            <button id="close-modal-btn" class="cta-btn">关闭</button>
        </div>
    </div>

    <script src="shop.js"></script>
</body>
</html>"""

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)


# --- CSS Overhaul ---
css_content = """/* shop.css - 个性化健康商城样式 */

/* 页面容器基础样式 */
.shop-container {
    max-width: 375px;
    margin: 0 auto;
    background-color: var(--bg-primary, #121212);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    color: var(--text-primary, #ffffff);
    font-family: 'Inter', 'Noto Serif SC', sans-serif;
    position: relative;
    overflow-x: hidden;
}

/* 顶部头部 */
.shop-header {
    padding: 20px;
    padding-top: 30px;
    transition: background 0.5s ease;
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%);
}

.header-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.back-btn {
    color: rgba(255,255,255,0.8);
    text-decoration: none;
    font-size: 14px;
}

.logo {
    font-size: 16px;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
}

.cart-icon {
    position: relative;
    font-size: 18px;
    cursor: pointer;
}

.cart-badge {
    position: absolute;
    top: -5px;
    right: -8px;
    background: #f43f5e;
    color: white;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 5px;
    border-radius: 10px;
}

.element-info h1 {
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 8px;
    font-family: 'Noto Serif SC', serif;
}

.element-info p {
    font-size: 13px;
    line-height: 1.6;
    color: rgba(255,255,255,0.85);
}

/* 搜索与筛选区 */
.shop-controls {
    background: var(--bg-primary);
    position: sticky;
    top: 0;
    z-index: 100;
    padding-top: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-container {
    padding: 0 20px 15px 20px;
}

.search-bar {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 8px 15px;
    display: flex;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-bar input {
    background: transparent;
    border: none;
    color: white;
    width: 100%;
    margin-left: 10px;
    font-size: 13px;
    outline: none;
}

/* 分类导航栏 */
.category-tabs {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0 20px 15px 20px;
    scrollbar-width: none; 
    -ms-overflow-style: none;
    scroll-behavior: smooth;
}

.category-tabs::-webkit-scrollbar {
    display: none;
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
    margin-right: 20px; /* 滚动余量 */
}

.tab-btn.active {
    background: var(--accent-color, #00d2ad);
    color: #000;
    border-color: var(--accent-color, #00d2ad);
    font-weight: 600;
    box-shadow: 0 0 10px rgba(0, 210, 173, 0.3);
}

/* 排序筛选条 */
.filter-bar {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.filter-item {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
    align-items: center;
}

.filter-item.active {
    color: var(--accent-color, #00d2ad);
    font-weight: 600;
}

/* 主内容区 */
.shop-main {
    padding: 15px 20px;
    flex: 1;
    background: #0f0f0f;
}

.ai-explanation {
    background: rgba(0, 210, 173, 0.05);
    border-left: 3px solid var(--accent-color, #00d2ad);
    border-radius: 0 8px 8px 0;
    padding: 12px 15px;
    margin-bottom: 20px;
}

.ai-explanation h3 {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 5px;
    color: var(--accent-color, #00d2ad);
}

.ai-explanation p {
    font-size: 12px;
    line-height: 1.5;
    color: rgba(255,255,255,0.8);
}

/* 商品网格 */
.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 30px;
}

/* 商品卡片：玻璃态风格升级 */
.product-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.3);
    border-color: rgba(255,255,255,0.15);
}

.product-img-box {
    background: rgba(255,255,255,0.02);
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    position: relative;
}

.sales-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(0,0,0,0.6);
    color: rgba(255,255,255,0.9);
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
}

.product-info {
    padding: 12px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.product-name {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 4px;
    color: rgba(255,255,255,0.95);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-desc {
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.product-bottom {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.product-price {
    font-size: 16px;
    font-weight: 600;
    color: #f59e0b;
}

.product-price span {
    font-size: 12px;
}

.add-cart-btn {
    background: var(--accent-color, #00d2ad);
    color: #000;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: transform 0.1s;
}

.add-cart-btn:active {
    transform: scale(0.9);
}

.bottom-loading {
    text-align: center;
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    padding: 20px 0;
}

/* 弹窗样式 */
.modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-card {
    background: #1f2937;
    border-radius: 16px;
    padding: 30px 24px;
    width: 80%;
    max-width: 320px;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.modal-icon {
    font-size: 40px;
    margin-bottom: 15px;
}

.modal-card h3 {
    margin-bottom: 10px;
    font-size: 18px;
}

.modal-card p {
    font-size: 13px;
    color: #9ca3af;
    margin-bottom: 20px;
    line-height: 1.5;
}

.qr-placeholder {
    width: 160px;
    height: 160px;
    background: rgba(255,255,255,0.05);
    border: 1px dashed rgba(255,255,255,0.2);
    margin: 0 auto 20px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.4);
    font-size: 12px;
    border-radius: 8px;
}

.cta-btn {
    width: 100%;
    padding: 12px;
    background: var(--accent-color, #00d2ad);
    color: #000;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
}

/* 动画 */
.fade-in { animation: fadeIn 0.4s ease; }
.fade-in-up { animation: fadeInUp 0.4s ease; }

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
"""

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

# --- JS Overhaul ---
# Generate rich data per category
import random

def gen_products(category, base_products):
    res = []
    # Add base products with mock sales and dates
    for i, p in enumerate(base_products):
        res.append({
            'name': p['name'],
            'desc': p['desc'],
            'price': p['price'],
            'emoji': p['emoji'],
            'sales': random.randint(100, 5000),
            'isNew': i == 0
        })
    # Add dummy products to make it look full (at least 8 products)
    dummy_emojis = ['📦', '🌿', '🎁', '🍵', '🍯', '🍂']
    for i in range(len(base_products), 8):
        res.append({
            'name': f"{category}调养好物 {i+1}号",
            'desc': f"精选优质产地 · 匠心制作",
            'price': round(random.uniform(20, 199), 1),
            'emoji': random.choice(dummy_emojis),
            'sales': random.randint(10, 1000),
            'isNew': random.random() > 0.7
        })
    return res

wood_prods = gen_products('木型', [
    {'name': '疏肝理气茶', 'desc': '玫瑰+佛手+陈皮 · 15袋装', 'price': 39.9, 'emoji': '🍵'},
    {'name': '枸杞菊花养肝茶', 'desc': '杭白菊 宁夏枸杞 · 30包', 'price': 29.9, 'emoji': '🌼'},
    {'name': '护肝食材组合包', 'desc': '菠菜+枸杞+山药干 · 周装', 'price': 49.9, 'emoji': '🥬'},
    {'name': '安神助眠香薰', 'desc': '薰衣草 佛手柑精油 · 10ml', 'price': 59.0, 'emoji': '🕯️'}
])
fire_prods = gen_products('火型', [
    {'name': '莲子百合安神茶', 'desc': '莲子心 百合+酸枣仁 · 15袋', 'price': 35.9, 'emoji': '🍵'},
    {'name': '酸枣仁助眠膏', 'desc': '古法熬制 · 150g/瓶', 'price': 68.0, 'emoji': '🍯'},
    {'name': '苦瓜降火片', 'desc': '冻干苦瓜+菊花 · 30片', 'price': 25.9, 'emoji': '💊'},
    {'name': '冰糖银耳即食羹', 'desc': '润燥养心 · 6罐装', 'price': 42.0, 'emoji': '🥣'}
])
earth_prods = gen_products('土型', [
    {'name': '四神汤料包', 'desc': '山药+莲子+芡实+茯苓 · 10包', 'price': 45.9, 'emoji': '🍲'},
    {'name': '红豆薏米茶', 'desc': '炒薏米 赤小豆 · 30袋', 'price': 32.9, 'emoji': '🍵'},
    {'name': '山药饼干（代餐）', 'desc': '铁棍山药 · 低糖配方', 'price': 28.0, 'emoji': '🍘'},
    {'name': '艾灸贴（脾俞穴）', 'desc': '自发热艾叶贴 · 20片', 'price': 38.0, 'emoji': '🔥'}
])
metal_prods = gen_products('金型', [
    {'name': '川贝枇杷膏', 'desc': '古法熬制 · 老字号 · 200g', 'price': 58.0, 'emoji': '🍯'},
    {'name': '雪梨银耳即食羹', 'desc': '润肺养颜 · 6罐装', 'price': 45.0, 'emoji': '🥣'},
    {'name': '罗汉果菊花茶', 'desc': '清肺利咽 · 20袋装', 'price': 26.9, 'emoji': '🍵'},
    {'name': '蜂蜜柚子茶', 'desc': '手工熬制 · 500g罐装', 'price': 39.9, 'emoji': '🍯'}
])
water_prods = gen_products('水型', [
    {'name': '黑芝麻核桃丸', 'desc': '九蒸九晒 · 补肾乌发 · 200g', 'price': 55.0, 'emoji': '⚫'},
    {'name': '杜仲枸杞养肾茶', 'desc': '杜仲+枸杞+桑葚 · 15袋', 'price': 42.9, 'emoji': '🍵'},
    {'name': '艾灸贴（肾俞穴）', 'desc': '温肾散寒 · 20片装', 'price': 38.0, 'emoji': '🔥'},
    {'name': '黑豆黑米组合', 'desc': '补肾粗粮 · 2kg装', 'price': 35.0, 'emoji': '🌾'}
])

daily_tea_prods = gen_products('茶饮', [
    {'name': '四季元气茶', 'desc': '人参 枸杞 红枣 · 30包', 'price': 49.9, 'emoji': '🫖'},
    {'name': '桂圆红枣茶', 'desc': '温补气血 · 15包', 'price': 29.9, 'emoji': '🍎'},
    {'name': '陈皮普洱茶', 'desc': '新会陈皮 熟普 · 散装100g', 'price': 88.0, 'emoji': '🍵'},
    {'name': '茉莉花绿茶', 'desc': '清新解郁 · 20包', 'price': 25.0, 'emoji': '🌸'}
])
snacks_prods = gen_products('零食', [
    {'name': '无糖黑芝麻丸', 'desc': '黑发养发 独立包装 · 250g', 'price': 39.0, 'emoji': '🖤'},
    {'name': '山楂六物膏', 'desc': '消食健脾 · 1瓶', 'price': 45.0, 'emoji': '🏺'},
    {'name': '红豆芡实糕', 'desc': '健脾祛湿 饱腹 · 300g', 'price': 28.0, 'emoji': '🥮'},
    {'name': '原味山药薄片', 'desc': '低卡烘焙 非油炸 · 5袋', 'price': 19.9, 'emoji': '🥔'}
])
equipments_prods = gen_products('器具', [
    {'name': '便携智能艾灸盒', 'desc': '无烟过滤 温度可调', 'price': 198.0, 'emoji': '♨️'},
    {'name': '天然牛角刮痧板', 'desc': '加厚款 附穴位图', 'price': 29.9, 'emoji': '🪒'},
    {'name': '中药泡脚包', 'desc': '艾草 老姜 益母草 · 30包', 'price': 35.0, 'emoji': '🦶'},
    {'name': '恒温加热腰带', 'desc': '暖宫护腰 三档温控', 'price': 128.0, 'emoji': '🛡️'}
])

import json

js_content = f"""// shop.js - 高端电商级商城逻辑

const SHOP_DATA = {{
    wood: {{
        type: 'element', title: '木型体质 · 疏肝理气', tabName: '木·肝', color: '#2d6a4f',
        reason: '木型体质肝火偏旺，需要疏肝、养血、柔肝的食材来调理。春季尤其要注意情绪管理和肝脏养护。',
        products: {json.dumps(wood_prods, ensure_ascii=False)}
    }},
    fire: {{
        type: 'element', title: '火型体质 · 清心养神', tabName: '火·心', color: '#c9184a',
        reason: '火型体质心火偏旺，容易失眠、口干、心烦。需要清心降火、养阴安神的调理。',
        products: {json.dumps(fire_prods, ensure_ascii=False)}
    }},
    earth: {{
        type: 'element', title: '土型体质 · 健脾祛湿', tabName: '土·脾', color: '#e6a817',
        reason: '土型体质脾胃运化能力偏弱，容易受湿气影响。需要健脾化湿、温补中气。',
        products: {json.dumps(earth_prods, ensure_ascii=False)}
    }},
    metal: {{
        type: 'element', title: '金型体质 · 润肺养阴', tabName: '金·肺', color: '#6c757d',
        reason: '金型体质肺气偏弱，皮肤易干燥，秋冬容易咳嗽。需要润肺养阴、滋润呼吸道。',
        products: {json.dumps(metal_prods, ensure_ascii=False)}
    }},
    water: {{
        type: 'element', title: '水型体质 · 温肾固本', tabName: '水·肾', color: '#1a237e',
        reason: '水型体质肾气不足，容易腰酸、怕冷、夜尿频。需要温肾壮阳、益精填髓。',
        products: {json.dumps(water_prods, ensure_ascii=False)}
    }},
    daily_tea: {{
        type: 'regular', title: '日常茶饮 · 平性温和', tabName: '日常茶饮', color: '#00d2ad', reason: '',
        products: {json.dumps(daily_tea_prods, ensure_ascii=False)}
    }},
    snacks: {{
        type: 'regular', title: '健康零食 · 药食同源', tabName: '健康零食', color: '#f59e0b', reason: '',
        products: {json.dumps(snacks_prods, ensure_ascii=False)}
    }},
    equipments: {{
        type: 'regular', title: '理疗器具 · 居家必备', tabName: '理疗器具', color: '#6366f1', reason: '',
        products: {json.dumps(equipments_prods, ensure_ascii=False)}
    }}
}};

const CATEGORY_ORDER = ['user_element', 'wood', 'fire', 'earth', 'metal', 'water', 'daily_tea', 'snacks', 'equipments'];

document.addEventListener('DOMContentLoaded', () => {{
    // 防止缓存导致旧版JS运行
    console.log("V3 Shop Engine Initialized");

    const urlParams = new URLSearchParams(window.location.search);
    let userElement = urlParams.get('element') || 'earth'; 
    if (!SHOP_DATA[userElement]) userElement = 'earth';

    let currentCategoryId = userElement;
    let currentSort = 'default';

    const tabsContainer = document.getElementById('category-tabs');
    const header = document.getElementById('shop-header');
    const titleEl = document.getElementById('element-title');
    const reasonEl = document.getElementById('element-reason');
    const reasonDetailEl = document.getElementById('element-reason-detail');
    const explanationSection = document.getElementById('ai-explanation-section');
    const productList = document.getElementById('product-list');

    // 绑定筛选事件
    document.querySelectorAll('.filter-item').forEach(el => {{
        el.addEventListener('click', (e) => {{
            const sortType = e.currentTarget.dataset.sort;
            if (sortType === 'price' && currentSort === 'price-asc') {{
                currentSort = 'price-desc';
                e.currentTarget.querySelector('.sort-arrow').textContent = '↓';
            }} else if (sortType === 'price') {{
                currentSort = 'price-asc';
                e.currentTarget.querySelector('.sort-arrow').textContent = '↑';
            }} else {{
                currentSort = sortType;
                // 重置价格箭头
                const priceBtn = document.querySelector('[data-sort="price"] .sort-arrow');
                if(priceBtn) priceBtn.textContent = '↕';
            }}
            
            document.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            renderCategory(currentCategoryId);
        }});
    }});

    function renderTabs() {{
        if (!tabsContainer) return;
        tabsContainer.innerHTML = '';
        
        CATEGORY_ORDER.forEach(catId => {{
            let actualId = catId;
            let tabLabel = '';
            
            if (catId === 'user_element') {{
                actualId = userElement;
                tabLabel = '⭐ 专属推荐';
            }} else {{
                if (catId === userElement) return; 
                tabLabel = SHOP_DATA[catId].tabName;
            }}

            const btn = document.createElement('button');
            btn.className = `tab-btn ${{currentCategoryId === actualId ? 'active' : ''}}`;
            btn.textContent = tabLabel;
            btn.onclick = () => {{
                if (currentCategoryId !== actualId) {{
                    currentCategoryId = actualId;
                    renderTabs();
                    renderCategory(actualId);
                }}
            }};
            tabsContainer.appendChild(btn);
        }});
        
        // 滚动对齐
        setTimeout(() => {{
            const activeTab = tabsContainer.querySelector('.active');
            if (activeTab) {{
                tabsContainer.scrollTo({{
                    left: activeTab.offsetLeft - tabsContainer.offsetWidth / 2 + activeTab.offsetWidth / 2,
                    behavior: 'smooth'
                }});
            }}
        }}, 50);
    }}

    function renderCategory(categoryId) {{
        const data = SHOP_DATA[categoryId];
        
        // 更新头部视觉
        header.style.background = `linear-gradient(135deg, ${{data.color}}E6 0%, ${{data.color}}00 100%)`;
        titleEl.textContent = data.title;
        
        productList.classList.remove('fade-in');
        void productList.offsetWidth; 
        productList.classList.add('fade-in');

        if (data.type === 'element') {{
            reasonEl.textContent = data.reason;
            reasonDetailEl.textContent = `由于${{data.reason}}`;
            explanationSection.style.display = 'block';
        }} else {{
            reasonEl.textContent = '通用调养系列，适合全家共享';
            explanationSection.style.display = 'none';
        }}

        // 获取并排序商品
        let sortedProducts = [...data.products];
        if (currentSort === 'sales') {{
            sortedProducts.sort((a, b) => b.sales - a.sales);
        }} else if (currentSort === 'price-asc') {{
            sortedProducts.sort((a, b) => a.price - b.price);
        }} else if (currentSort === 'price-desc') {{
            sortedProducts.sort((a, b) => b.price - a.price);
        }} else if (currentSort === 'new') {{
            sortedProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        }}

        // 渲染商品
        productList.innerHTML = '';
        sortedProducts.forEach(product => {{
            const card = document.createElement('div');
            card.className = 'product-card';
            
            const newBadge = product.isNew ? `<div class="sales-badge" style="background:#f43f5e; left:auto; right:8px;">新品</div>` : '';
            
            card.innerHTML = `
                <div class="product-img-box">
                    <div class="sales-badge">热销 ${{product.sales}}+</div>
                    ${{newBadge}}
                    ${{product.emoji || '📦'}}
                </div>
                <div class="product-info">
                    <div class="product-name">${{product.name}}</div>
                    <div class="product-desc">${{product.desc}}</div>
                    <div class="product-bottom">
                        <div class="product-price"><span>¥</span>${{product.price.toFixed(1)}}</div>
                        <button class="add-cart-btn" onclick="openPurchaseModal()">+</button>
                    </div>
                </div>
            `;
            productList.appendChild(card);
        }});
    }}

    const modal = document.getElementById('purchase-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    if (modal) modal.addEventListener('click', (e) => {{
        if(e.target === modal) modal.style.display = 'none';
    }});

    renderTabs();
    renderCategory(currentCategoryId);
}});

function openPurchaseModal() {{
    const modal = document.getElementById('purchase-modal');
    if(modal) modal.style.display = 'flex';
}}
"""

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Shop highly overhauled successfully.")
