// shop.js - 高端电商级商城逻辑

const SHOP_DATA = {
    wood: {
        type: 'element', title: '木型体质 · 疏肝理气', tabName: '木·肝', color: '#2d6a4f',
        reason: '木型体质肝火偏旺，需要疏肝、养血、柔肝的食材来调理。春季尤其要注意情绪管理和肝脏养护。',
        products: [{"name": "疏肝理气茶", "desc": "玫瑰+佛手+陈皮 · 15袋装", "price": 39.9, "emoji": "🍵", "sales": 468, "isNew": true}, {"name": "枸杞菊花养肝茶", "desc": "杭白菊 宁夏枸杞 · 30包", "price": 29.9, "emoji": "🌼", "sales": 2414, "isNew": false}, {"name": "护肝食材组合包", "desc": "菠菜+枸杞+山药干 · 周装", "price": 49.9, "emoji": "🥬", "sales": 3304, "isNew": false}, {"name": "安神助眠香薰", "desc": "薰衣草 佛手柑精油 · 10ml", "price": 59.0, "emoji": "🕯️", "sales": 3892, "isNew": false}, {"name": "木型调养好物 5号", "desc": "精选优质产地 · 匠心制作", "price": 151.3, "emoji": "🍯", "sales": 528, "isNew": false}, {"name": "木型调养好物 6号", "desc": "精选优质产地 · 匠心制作", "price": 62.0, "emoji": "📦", "sales": 621, "isNew": false}, {"name": "木型调养好物 7号", "desc": "精选优质产地 · 匠心制作", "price": 25.2, "emoji": "🍂", "sales": 954, "isNew": false}, {"name": "木型调养好物 8号", "desc": "精选优质产地 · 匠心制作", "price": 140.0, "emoji": "🍂", "sales": 998, "isNew": true}]
    },
    fire: {
        type: 'element', title: '火型体质 · 清心养神', tabName: '火·心', color: '#c9184a',
        reason: '火型体质心火偏旺，容易失眠、口干、心烦。需要清心降火、养阴安神的调理。',
        products: [{"name": "莲子百合安神茶", "desc": "莲子心 百合+酸枣仁 · 15袋", "price": 35.9, "emoji": "🍵", "sales": 4749, "isNew": true}, {"name": "酸枣仁助眠膏", "desc": "古法熬制 · 150g/瓶", "price": 68.0, "emoji": "🍯", "sales": 2260, "isNew": false}, {"name": "苦瓜降火片", "desc": "冻干苦瓜+菊花 · 30片", "price": 25.9, "emoji": "💊", "sales": 3647, "isNew": false}, {"name": "冰糖银耳即食羹", "desc": "润燥养心 · 6罐装", "price": 42.0, "emoji": "🥣", "sales": 3077, "isNew": false}, {"name": "火型调养好物 5号", "desc": "精选优质产地 · 匠心制作", "price": 193.1, "emoji": "🍂", "sales": 155, "isNew": false}, {"name": "火型调养好物 6号", "desc": "精选优质产地 · 匠心制作", "price": 52.5, "emoji": "🎁", "sales": 401, "isNew": true}, {"name": "火型调养好物 7号", "desc": "精选优质产地 · 匠心制作", "price": 130.9, "emoji": "🌿", "sales": 320, "isNew": false}, {"name": "火型调养好物 8号", "desc": "精选优质产地 · 匠心制作", "price": 195.8, "emoji": "📦", "sales": 697, "isNew": true}]
    },
    earth: {
        type: 'element', title: '土型体质 · 健脾祛湿', tabName: '土·脾', color: '#e6a817',
        reason: '土型体质脾胃运化能力偏弱，容易受湿气影响。需要健脾化湿、温补中气。',
        products: [{"name": "四神汤料包", "desc": "山药+莲子+芡实+茯苓 · 10包", "price": 45.9, "emoji": "🍲", "sales": 659, "isNew": true}, {"name": "红豆薏米茶", "desc": "炒薏米 赤小豆 · 30袋", "price": 32.9, "emoji": "🍵", "sales": 434, "isNew": false}, {"name": "山药饼干（代餐）", "desc": "铁棍山药 · 低糖配方", "price": 28.0, "emoji": "🍘", "sales": 3069, "isNew": false}, {"name": "艾灸贴（脾俞穴）", "desc": "自发热艾叶贴 · 20片", "price": 38.0, "emoji": "🔥", "sales": 1117, "isNew": false}, {"name": "土型调养好物 5号", "desc": "精选优质产地 · 匠心制作", "price": 90.2, "emoji": "🎁", "sales": 800, "isNew": true}, {"name": "土型调养好物 6号", "desc": "精选优质产地 · 匠心制作", "price": 124.3, "emoji": "🍂", "sales": 504, "isNew": true}, {"name": "土型调养好物 7号", "desc": "精选优质产地 · 匠心制作", "price": 99.3, "emoji": "🍂", "sales": 886, "isNew": false}, {"name": "土型调养好物 8号", "desc": "精选优质产地 · 匠心制作", "price": 68.7, "emoji": "🍵", "sales": 792, "isNew": true}]
    },
    metal: {
        type: 'element', title: '金型体质 · 润肺养阴', tabName: '金·肺', color: '#6c757d',
        reason: '金型体质肺气偏弱，皮肤易干燥，秋冬容易咳嗽。需要润肺养阴、滋润呼吸道。',
        products: [{"name": "川贝枇杷膏", "desc": "古法熬制 · 老字号 · 200g", "price": 58.0, "emoji": "🍯", "sales": 2849, "isNew": true}, {"name": "雪梨银耳即食羹", "desc": "润肺养颜 · 6罐装", "price": 45.0, "emoji": "🥣", "sales": 2961, "isNew": false}, {"name": "罗汉果菊花茶", "desc": "清肺利咽 · 20袋装", "price": 26.9, "emoji": "🍵", "sales": 737, "isNew": false}, {"name": "蜂蜜柚子茶", "desc": "手工熬制 · 500g罐装", "price": 39.9, "emoji": "🍯", "sales": 561, "isNew": false}, {"name": "金型调养好物 5号", "desc": "精选优质产地 · 匠心制作", "price": 106.9, "emoji": "🍂", "sales": 472, "isNew": false}, {"name": "金型调养好物 6号", "desc": "精选优质产地 · 匠心制作", "price": 34.1, "emoji": "📦", "sales": 455, "isNew": true}, {"name": "金型调养好物 7号", "desc": "精选优质产地 · 匠心制作", "price": 142.9, "emoji": "🍂", "sales": 185, "isNew": false}, {"name": "金型调养好物 8号", "desc": "精选优质产地 · 匠心制作", "price": 175.8, "emoji": "🍵", "sales": 57, "isNew": false}]
    },
    water: {
        type: 'element', title: '水型体质 · 温肾固本', tabName: '水·肾', color: '#1a237e',
        reason: '水型体质肾气不足，容易腰酸、怕冷、夜尿频。需要温肾壮阳、益精填髓。',
        products: [{"name": "黑芝麻核桃丸", "desc": "九蒸九晒 · 补肾乌发 · 200g", "price": 55.0, "emoji": "⚫", "sales": 4068, "isNew": true}, {"name": "杜仲枸杞养肾茶", "desc": "杜仲+枸杞+桑葚 · 15袋", "price": 42.9, "emoji": "🍵", "sales": 1436, "isNew": false}, {"name": "艾灸贴（肾俞穴）", "desc": "温肾散寒 · 20片装", "price": 38.0, "emoji": "🔥", "sales": 4433, "isNew": false}, {"name": "黑豆黑米组合", "desc": "补肾粗粮 · 2kg装", "price": 35.0, "emoji": "🌾", "sales": 344, "isNew": false}, {"name": "水型调养好物 5号", "desc": "精选优质产地 · 匠心制作", "price": 34.6, "emoji": "🍵", "sales": 861, "isNew": false}, {"name": "水型调养好物 6号", "desc": "精选优质产地 · 匠心制作", "price": 84.9, "emoji": "📦", "sales": 241, "isNew": false}, {"name": "水型调养好物 7号", "desc": "精选优质产地 · 匠心制作", "price": 32.3, "emoji": "🍯", "sales": 698, "isNew": false}, {"name": "水型调养好物 8号", "desc": "精选优质产地 · 匠心制作", "price": 186.9, "emoji": "🌿", "sales": 634, "isNew": false}]
    },
    daily_tea: {
        type: 'regular', title: '日常茶饮 · 平性温和', tabName: '日常茶饮', color: '#00d2ad', reason: '',
        products: [{"name": "四季元气茶", "desc": "人参 枸杞 红枣 · 30包", "price": 49.9, "emoji": "🫖", "sales": 2898, "isNew": true}, {"name": "桂圆红枣茶", "desc": "温补气血 · 15包", "price": 29.9, "emoji": "🍎", "sales": 293, "isNew": false}, {"name": "陈皮普洱茶", "desc": "新会陈皮 熟普 · 散装100g", "price": 88.0, "emoji": "🍵", "sales": 878, "isNew": false}, {"name": "茉莉花绿茶", "desc": "清新解郁 · 20包", "price": 25.0, "emoji": "🌸", "sales": 4247, "isNew": false}, {"name": "茶饮调养好物 5号", "desc": "精选优质产地 · 匠心制作", "price": 138.4, "emoji": "🎁", "sales": 37, "isNew": true}, {"name": "茶饮调养好物 6号", "desc": "精选优质产地 · 匠心制作", "price": 176.5, "emoji": "🎁", "sales": 792, "isNew": false}, {"name": "茶饮调养好物 7号", "desc": "精选优质产地 · 匠心制作", "price": 99.4, "emoji": "🍯", "sales": 49, "isNew": true}, {"name": "茶饮调养好物 8号", "desc": "精选优质产地 · 匠心制作", "price": 33.8, "emoji": "🍵", "sales": 892, "isNew": false}]
    },
    snacks: {
        type: 'regular', title: '健康零食 · 药食同源', tabName: '健康零食', color: '#f59e0b', reason: '',
        products: [{"name": "无糖黑芝麻丸", "desc": "黑发养发 独立包装 · 250g", "price": 39.0, "emoji": "🖤", "sales": 1169, "isNew": true}, {"name": "山楂六物膏", "desc": "消食健脾 · 1瓶", "price": 45.0, "emoji": "🏺", "sales": 3789, "isNew": false}, {"name": "红豆芡实糕", "desc": "健脾祛湿 饱腹 · 300g", "price": 28.0, "emoji": "🥮", "sales": 1340, "isNew": false}, {"name": "原味山药薄片", "desc": "低卡烘焙 非油炸 · 5袋", "price": 19.9, "emoji": "🥔", "sales": 2411, "isNew": false}, {"name": "零食调养好物 5号", "desc": "精选优质产地 · 匠心制作", "price": 61.7, "emoji": "📦", "sales": 327, "isNew": true}, {"name": "零食调养好物 6号", "desc": "精选优质产地 · 匠心制作", "price": 135.6, "emoji": "🌿", "sales": 167, "isNew": true}, {"name": "零食调养好物 7号", "desc": "精选优质产地 · 匠心制作", "price": 58.6, "emoji": "🍯", "sales": 157, "isNew": false}, {"name": "零食调养好物 8号", "desc": "精选优质产地 · 匠心制作", "price": 56.5, "emoji": "🍂", "sales": 643, "isNew": false}]
    },
    equipments: {
        type: 'regular', title: '理疗器具 · 居家必备', tabName: '理疗器具', color: '#6366f1', reason: '',
        products: [{"name": "便携智能艾灸盒", "desc": "无烟过滤 温度可调", "price": 198.0, "emoji": "♨️", "sales": 955, "isNew": true}, {"name": "天然牛角刮痧板", "desc": "加厚款 附穴位图", "price": 29.9, "emoji": "🪒", "sales": 4429, "isNew": false}, {"name": "中药泡脚包", "desc": "艾草 老姜 益母草 · 30包", "price": 35.0, "emoji": "🦶", "sales": 467, "isNew": false}, {"name": "恒温加热腰带", "desc": "暖宫护腰 三档温控", "price": 128.0, "emoji": "🛡️", "sales": 1626, "isNew": false}, {"name": "器具调养好物 5号", "desc": "精选优质产地 · 匠心制作", "price": 52.9, "emoji": "🌿", "sales": 40, "isNew": true}, {"name": "器具调养好物 6号", "desc": "精选优质产地 · 匠心制作", "price": 54.8, "emoji": "🍯", "sales": 604, "isNew": true}, {"name": "器具调养好物 7号", "desc": "精选优质产地 · 匠心制作", "price": 77.7, "emoji": "🍯", "sales": 335, "isNew": false}, {"name": "器具调养好物 8号", "desc": "精选优质产地 · 匠心制作", "price": 137.8, "emoji": "🍵", "sales": 764, "isNew": false}]
    }
};

const CATEGORY_ORDER = ['user_element', 'wood', 'fire', 'earth', 'metal', 'water', 'daily_tea', 'snacks', 'equipments'];

document.addEventListener('DOMContentLoaded', () => {
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
    document.querySelectorAll('.filter-item').forEach(el => {
        el.addEventListener('click', (e) => {
            const sortType = e.currentTarget.dataset.sort;
            if (sortType === 'price' && currentSort === 'price-asc') {
                currentSort = 'price-desc';
                e.currentTarget.querySelector('.sort-arrow').textContent = '↓';
            } else if (sortType === 'price') {
                currentSort = 'price-asc';
                e.currentTarget.querySelector('.sort-arrow').textContent = '↑';
            } else {
                currentSort = sortType;
                // 重置价格箭头
                const priceBtn = document.querySelector('[data-sort="price"] .sort-arrow');
                if(priceBtn) priceBtn.textContent = '↕';
            }
            
            document.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            renderCategory(currentCategoryId);
        });
    });

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
                if (catId === userElement) return; 
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
        
        // 滚动对齐
        setTimeout(() => {
            const activeTab = tabsContainer.querySelector('.active');
            if (activeTab) {
                tabsContainer.scrollTo({
                    left: activeTab.offsetLeft - tabsContainer.offsetWidth / 2 + activeTab.offsetWidth / 2,
                    behavior: 'smooth'
                });
            }
        }, 50);
    }

    function renderCategory(categoryId) {
        const data = SHOP_DATA[categoryId];
        
        // 更新头部视觉
        header.style.background = `linear-gradient(135deg, ${data.color}E6 0%, ${data.color}00 100%)`;
        titleEl.textContent = data.title;
        
        productList.classList.remove('fade-in');
        void productList.offsetWidth; 
        productList.classList.add('fade-in');

        if (data.type === 'element') {
            reasonEl.textContent = data.reason;
            reasonDetailEl.textContent = `由于${data.reason}`;
            explanationSection.style.display = 'block';
        } else {
            reasonEl.textContent = '通用调养系列，适合全家共享';
            explanationSection.style.display = 'none';
        }

        // 获取并排序商品
        let sortedProducts = [...data.products];
        if (currentSort === 'sales') {
            sortedProducts.sort((a, b) => b.sales - a.sales);
        } else if (currentSort === 'price-asc') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price-desc') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (currentSort === 'new') {
            sortedProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        }

        // 渲染商品
        productList.innerHTML = '';
        sortedProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            const newBadge = product.isNew ? `<div class="sales-badge" style="background:#f43f5e; left:auto; right:8px;">新品</div>` : '';
            
            card.innerHTML = `
                <div class="product-img-box">
                    <div class="sales-badge">热销 ${product.sales}+</div>
                    ${newBadge}
                    ${product.emoji || '📦'}
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-desc">${product.desc}</div>
                    <div class="product-bottom">
                        <div class="product-price"><span>¥</span>${product.price.toFixed(1)}</div>
                        <button class="add-cart-btn" onclick="openPurchaseModal()">+</button>
                    </div>
                </div>
            `;
            productList.appendChild(card);
        });
    }

    const modal = document.getElementById('purchase-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    if (modal) modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.style.display = 'none';
    });

    renderTabs();
    renderCategory(currentCategoryId);
});

function openPurchaseModal() {
    const modal = document.getElementById('purchase-modal');
    if(modal) modal.style.display = 'flex';
}
