/* ─── Report Preview Logic ─── */

(function () {
    'use strict';

    // ─── URL 参数读取体质类型 ───
    const params = new URLSearchParams(window.location.search);
    const constitutionType = params.get('type') || '土型体质';

    const typeEl = document.getElementById('constitution-type');
    if (typeEl) typeEl.textContent = constitutionType;

    // 设置日期
    const dateEl = document.getElementById('report-date');
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');
    }

    // ─── 体质数据（MVP 阶段 5 种体质硬编码） ───
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
