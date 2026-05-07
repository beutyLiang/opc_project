// shop.js - 动态渲染商城逻辑

const SHOP_DATA = {
    wood: {
        title: '木型体质 · 疏肝理气',
        color: '#2d6a4f',  // 绿色系
        reason: '木型体质肝火偏旺，需要疏肝、养血、柔肝的食材来调理。春季尤其要注意情绪管理和肝脏养护。',
        products: [
            { name: '疏肝理气茶', desc: '玫瑰+佛手+陈皮 · 15袋装', price: 39.9, emoji: '🍵' },
            { name: '枸杞菊花养肝茶', desc: '杭白菊 宁夏枸杞 · 30包', price: 29.9, emoji: '🌼' },
            { name: '护肝食材组合包', desc: '菠菜+枸杞+山药干 · 周装', price: 49.9, emoji: '🥬' },
            { name: '安神助眠香薰', desc: '薰衣草 佛手柑精油 · 10ml', price: 59.0, emoji: '🕯️' }
        ]
    },
    fire: {
        title: '火型体质 · 清心养神',
        color: '#c9184a',  // 红色系
        reason: '火型体质心火偏旺，容易失眠、口干、心烦。需要清心降火、养阴安神的调理。',
        products: [
            { name: '莲子百合安神茶', desc: '莲子心 百合+酸枣仁 · 15袋', price: 35.9, emoji: '🍵' },
            { name: '酸枣仁助眠膏', desc: '古法熬制 · 150g/瓶', price: 68.0, emoji: '🍯' },
            { name: '苦瓜降火片', desc: '冻干苦瓜+菊花 · 30片', price: 25.9, emoji: '💊' },
            { name: '冰糖银耳即食羹', desc: '润燥养心 · 6罐装', price: 42.0, emoji: '🥣' }
        ]
    },
    earth: {
        title: '土型体质 · 健脾祛湿',
        color: '#e6a817',  // 土黄色系
        reason: '土型体质脾胃运化能力偏弱，容易受湿气影响。需要健脾化湿、温补中气。',
        products: [
            { name: '四神汤料包', desc: '山药+莲子+芡实+茯苓 · 10包', price: 45.9, emoji: '🍲' },
            { name: '红豆薏米茶', desc: '炒薏米 赤小豆 · 30袋', price: 32.9, emoji: '🍵' },
            { name: '山药饼干（代餐）', desc: '铁棍山药 · 低糖配方', price: 28.0, emoji: '🍘' },
            { name: '艾灸贴（脾俞穴）', desc: '自发热艾叶贴 · 20片', price: 38.0, emoji: '🔥' }
        ]
    },
    metal: {
        title: '金型体质 · 润肺养阴',
        color: '#6c757d',  // 金灰色系
        reason: '金型体质肺气偏弱，皮肤易干燥，秋冬容易咳嗽。需要润肺养阴、滋润呼吸道。',
        products: [
            { name: '川贝枇杷膏', desc: '古法熬制 · 老字号 · 200g', price: 58.0, emoji: '🍯' },
            { name: '雪梨银耳即食羹', desc: '润肺养颜 · 6罐装', price: 45.0, emoji: '🥣' },
            { name: '罗汉果菊花茶', desc: '清肺利咽 · 20袋装', price: 26.9, emoji: '🍵' },
            { name: '蜂蜜柚子茶', desc: '手工熬制 · 500g罐装', price: 39.9, emoji: '🍯' }
        ]
    },
    water: {
        title: '水型体质 · 温肾固本',
        color: '#1a237e',  // 深蓝色系
        reason: '水型体质肾气不足，容易腰酸、怕冷、夜尿频。需要温肾壮阳、益精填髓。',
        products: [
            { name: '黑芝麻核桃丸', desc: '九蒸九晒 · 补肾乌发 · 200g', price: 55.0, emoji: '⚫' },
            { name: '杜仲枸杞养肾茶', desc: '杜仲+枸杞+桑葚 · 15袋', price: 42.9, emoji: '🍵' },
            { name: '艾灸贴（肾俞穴）', desc: '温肾散寒 · 20片装', price: 38.0, emoji: '🔥' },
            { name: '黑豆黑米组合', desc: '补肾粗粮 · 2kg装', price: 35.0, emoji: '🌾' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 解析 URL
    const urlParams = new URLSearchParams(window.location.search);
    let element = urlParams.get('element') || 'earth'; // 默认土型

    if (!SHOP_DATA[element]) {
        element = 'earth';
    }

    const data = SHOP_DATA[element];

    // 更新页面头部
    const header = document.getElementById('shop-header');
    header.style.background = `linear-gradient(135deg, ${data.color}E6 0%, ${data.color}00 100%)`; // 带透明度的颜色
    
    document.getElementById('element-title').textContent = data.title;
    document.getElementById('element-reason').textContent = data.reason;
    document.getElementById('element-reason-detail').textContent = `由于${data.reason}`;

    // 渲染商品
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // 清空

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

    // 弹窗逻辑
    const modal = document.getElementById('purchase-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 点击弹窗外部关闭
    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function openPurchaseModal() {
    document.getElementById('purchase-modal').style.display = 'flex';
}
