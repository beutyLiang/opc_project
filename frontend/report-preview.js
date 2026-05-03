/* ─── Report Preview Logic ─── */

(function () {
    'use strict';

    // ─── 新增：URL 参数读取 ?element ───
    const params = new URLSearchParams(window.location.search);
    const elementMap = {
        'wood': '木型体质',
        'fire': '火型体质',
        'earth': '土型体质',
        'metal': '金型体质',
        'water': '水型体质'
    };
    const element = params.get('element') || 'earth';
    const constitutionType = elementMap[element] || '土型体质';

    const typeEl = document.getElementById('constitution-type');
    if (typeEl) typeEl.textContent = constitutionType;

    // 更新商城闭环入口链接
    const shopLink = document.getElementById('dynamic-shop-link');
    if (shopLink) {
        shopLink.href = `shop.html?element=${element}`;
    }

    // 设置日期
    const dateEl = document.getElementById('report-date');
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');
    }

    // ─── 体质数据与雷达/饮食数据 ───
    const CONSTITUTION_DATA = {
        '木型体质': {
            desc: '木型体质的人肝胆功能较强，性格果断有主见，但容易急躁易怒。春季是木型体质的旺季，需要注意疏肝理气。',
            traits: [
                '性格特征：果断有主见，行动力强',
                '易发问题：肝火旺盛，失眠多梦',
                '体型特征：身材修长，面色偏青'
            ],
            tips: [
                '多食绿色蔬菜，如芹菜、菠菜',
                '保持心情舒畅，避免郁怒',
                '推荐运动：八段锦、慢跑'
            ],
            radarData: [85, 45, 60, 50, 40],
            radarColor: '#2d6a4f',
            dietGood: '菠菜、枸杞、山药、绿豆',
            dietBad: '辣椒、油炸食品、烈酒'
        },
        '火型体质': {
            desc: '火型体质的人心脏功能活跃，性格热情开朗，但容易心烦气躁。夏季需格外注意养心安神。',
            traits: [
                '性格特征：热情开朗，善于表达',
                '易发问题：心烦失眠，口舌生疮',
                '体型特征：面色红润，手脚温热'
            ],
            tips: [
                '多食苦味食物，如苦瓜、莲子',
                '避免过度兴奋和熬夜',
                '推荐运动：游泳、瑜伽'
            ],
            radarData: [40, 85, 50, 45, 60],
            radarColor: '#c9184a',
            dietGood: '苦瓜、莲子、百合、西瓜',
            dietBad: '羊肉、桂圆、煎烤食品'
        },
        '土型体质': {
            desc: '土型体质的人脾胃功能较为突出，性格沉稳踏实，做事有条理。但容易受湿气影响，需要注意健脾祛湿。',
            traits: [
                '消化能力：较强，但易受湿气影响',
                '情绪特征：温和稳重，但容易多思',
                '体型特征：肌肉丰满，四肢温暖'
            ],
            tips: [
                '饮食宜温热，忌生冷寒凉',
                '保持规律作息，避免过度思虑',
                '适量运动，推荐散步和太极'
            ],
            radarData: [50, 40, 85, 60, 45],
            radarColor: '#e6a817',
            dietGood: '山药、薏米、陈皮、茯苓',
            dietBad: '冷饮、甜腻食品、海鲜'
        },
        '金型体质': {
            desc: '金型体质的人肺部功能突出，性格内敛沉稳，注重细节。秋季需注意润肺养阴，防止干燥。',
            traits: [
                '性格特征：沉稳内敛，做事严谨',
                '易发问题：皮肤干燥，呼吸道敏感',
                '体型特征：皮肤白皙，骨骼匀称'
            ],
            tips: [
                '多食白色食物，如梨、百合、银耳',
                '保持室内湿度，避免干燥环境',
                '推荐运动：深呼吸、登山'
            ],
            radarData: [45, 50, 60, 85, 40],
            radarColor: '#6c757d',
            dietGood: '雪梨、百合、白萝卜、银耳',
            dietBad: '辣椒、生葱、生蒜'
        },
        '水型体质': {
            desc: '水型体质的人肾脏功能较强，性格沉静有智慧，但容易畏寒怕冷。冬季需要注意固肾保暖。',
            traits: [
                '性格特征：沉静睿智，思虑深远',
                '易发问题：腰膝酸软，怕冷易倦',
                '体型特征：面色偏暗，下肢易水肿'
            ],
            tips: [
                '多食黑色食物，如黑芝麻、黑豆',
                '注意保暖，避免寒冷刺激',
                '推荐运动：站桩、太极'
            ],
            radarData: [60, 45, 40, 50, 85],
            radarColor: '#1a237e',
            dietGood: '黑芝麻、黑豆、核桃、桑葚',
            dietBad: '生冷瓜果、寒性食物'
        }
    };

    // ─── 渲染体质数据 ───
    const data = CONSTITUTION_DATA[constitutionType];
    if (data) {
        const descEl = document.getElementById('constitution-desc');
        if (descEl) descEl.textContent = data.desc;

        const traitsEl = document.getElementById('core-traits');
        if (traitsEl) {
            traitsEl.innerHTML = data.traits.map(t => '<li>' + t + '</li>').join('');
        }

        const tipsEl = document.getElementById('general-tips');
        if (tipsEl) {
            tipsEl.innerHTML = data.tips.map(t => '<li>' + t + '</li>').join('');
        }

        // 渲染红绿灯
        const dietLightsEl = document.getElementById('diet-lights');
        if (dietLightsEl) {
            dietLightsEl.innerHTML = `
                <div class="diet-row">
                    <div class="diet-col good">
                        <h4>🟢 宜吃</h4>
                        <p>${data.dietGood}</p>
                    </div>
                    <div class="diet-col bad">
                        <h4>🔴 忌吃</h4>
                        <p>${data.dietBad}</p>
                    </div>
                </div>
            `;
        }

        // 渲染雷达图
        const ctx = document.getElementById('radarChart');
        if (ctx && window.Chart) {
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['木·肝', '火·心', '土·脾', '金·肺', '水·肾'],
                    datasets: [{
                        label: '你的五行指数',
                        data: data.radarData,
                        backgroundColor: data.radarColor + '33', // 20% opacity
                        borderColor: data.radarColor,
                        pointBackgroundColor: data.radarColor,
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: data.radarColor
                    }]
                },
                options: {
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 12 } },
                            ticks: { display: false, min: 0, max: 100 }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: 'rgba(255, 255, 255, 0.9)' }
                        }
                    }
                }
            });
        }
    }

    // ─── 支付弹窗 ───
    window.openPayment = function (tier) {
        const modal = document.getElementById('payment-modal');
        const title = document.getElementById('payment-title');
        if (title) {
            title.textContent = tier === 'basic' ? '支付 ¥9.9' : '支付 ¥29.9';
        }
        if (modal) modal.style.display = 'flex';
    };

    window.closePayment = function () {
        const modal = document.getElementById('payment-modal');
        if (modal) modal.style.display = 'none';
    };

    // 点击遮罩层关闭
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === e.currentTarget) {
                window.closePayment();
            }
        });
    }

    // ESC 关闭弹窗
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            window.closePayment();
        }
    });

})();
