/**
 * 初序 菜谱 API 模块
 * Phase 1: Mock 数据 | Phase 2: 天行数据 API（经后端代理）
 */

const RecipeAPI = (() => {
    // 配置：Phase 2 切换为 true 并配置后端地址
    const USE_REAL_API = false;
    const API_BASE = '/api/recipe'; // 后端代理，Key 不暴露

    // localStorage 缓存
    const CACHE_KEY = 'chuxu_recipe_cache';
    const CACHE_TTL = 3600000; // 1 小时

    /**
     * 五行体质 → 推荐食材映射
     */
    const ELEMENT_FOOD_MAP = {
        wood: { element: '木', organ: '肝', flavor: '酸', foods: ['菠菜', '芹菜', '猕猴桃', '醋溜白菜'], avoid: '辛辣' },
        fire: { element: '火', organ: '心', flavor: '苦', foods: ['苦瓜', '莲子', '百合', '绿豆汤'], avoid: '大热食物' },
        earth: { element: '土', organ: '脾', flavor: '甘', foods: ['山药', '南瓜', '小米粥', '红枣'], avoid: '生冷' },
        metal: { element: '金', organ: '肺', flavor: '辛', foods: ['白萝卜', '银耳', '雪梨', '百合莲子羹'], avoid: '过咸' },
        water: { element: '水', organ: '肾', flavor: '咸', foods: ['黑豆', '核桃', '板栗', '黑芝麻糊'], avoid: '甜腻' }
    };

    /**
     * 预置菜谱（降级兜底 + Phase 1 Mock）
     */
    const FALLBACK_RECIPES = {
        fire: {
            name: '苦瓜酿肉',
            image: '',
            effect: '清热解毒，养肝平气',
            ingredients: ['苦瓜 2根', '猪肉馅 200g', '葱姜蒜适量', '生抽 1勺'],
            steps: ['苦瓜切段去瓤', '肉馅调味后填入', '上锅蒸15分钟', '淋上蒸鱼豉油即可'],
            cps_link: '#'
        },
        wood: {
            name: '醋溜白菜',
            image: '',
            effect: '疏肝理气，开胃消食',
            ingredients: ['大白菜 半棵', '陈醋 2勺', '干辣椒 3个', '花椒少许'],
            steps: ['白菜洗净切块', '热锅爆花椒干辣椒', '下白菜大火翻炒', '加醋调味出锅'],
            cps_link: '#'
        },
        earth: {
            name: '山药小米粥',
            image: '',
            effect: '健脾养胃，温补中气',
            ingredients: ['小米 100g', '铁棍山药 1根', '红枣 5颗', '枸杞少许'],
            steps: ['小米淘洗浸泡', '山药去皮切丁', '大火煮开转小火熬30分钟', '出锅前加枸杞'],
            cps_link: '#'
        },
        metal: {
            name: '冰糖雪梨银耳羹',
            image: '',
            effect: '润肺止咳，滋阴生津',
            ingredients: ['雪梨 2个', '银耳 半朵', '冰糖适量', '枸杞少许'],
            steps: ['银耳提前泡发撕小朵', '雪梨去核切块', '加水炖煮40分钟', '加冰糖枸杞收汁'],
            cps_link: '#'
        },
        water: {
            name: '核桃黑芝麻糊',
            image: '',
            effect: '补肾益精，乌发养颜',
            ingredients: ['核桃仁 50g', '黑芝麻 30g', '糯米粉 20g', '蜂蜜适量'],
            steps: ['核桃黑芝麻小火炒香', '放入料理机打粉', '加糯米粉和热水搅匀', '淋蜂蜜即可'],
            cps_link: '#'
        }
    };

    /**
     * 获取用户体质（从 localStorage）
     */
    function getUserElement() {
        try {
            const data = JSON.parse(localStorage.getItem('chuxu_constitution'));
            return data ? data.element : 'fire'; // 默认火
        } catch {
            return 'fire';
        }
    }

    /**
     * 从缓存获取菜谱
     */
    function getCached(keyword) {
        try {
            const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
            const entry = cache[keyword];
            if (entry && Date.now() - entry.time < CACHE_TTL) {
                return entry.data;
            }
        } catch { /* ignore */ }
        return null;
    }

    /**
     * 写入缓存
     */
    function setCache(keyword, data) {
        try {
            const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
            cache[keyword] = { data, time: Date.now() };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch { /* ignore */ }
    }

    /**
     * 调用后端代理获取真实菜谱（Phase 2）
     */
    async function fetchFromAPI(keyword) {
        const response = await fetch(`${API_BASE}?keyword=${encodeURIComponent(keyword)}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data;
    }

    /**
     * 主入口：获取推荐菜谱
     * @returns {Object} { recipe, elementInfo }
     */
    async function getRecommendation() {
        const element = getUserElement();
        const elementInfo = ELEMENT_FOOD_MAP[element];
        const keyword = elementInfo.foods[Math.floor(Math.random() * elementInfo.foods.length)];

        // 优先用缓存
        const cached = getCached(keyword);
        if (cached) {
            return { recipe: cached, elementInfo, fromCache: true };
        }

        // Phase 2: 真实 API
        if (USE_REAL_API) {
            try {
                const apiData = await fetchFromAPI(keyword);
                setCache(keyword, apiData);
                return { recipe: apiData, elementInfo, fromCache: false };
            } catch (err) {
                console.warn('菜谱 API 不可用，使用预置数据:', err);
            }
        }

        // 降级：预置菜谱
        const fallback = FALLBACK_RECIPES[element] || FALLBACK_RECIPES.fire;
        return { recipe: fallback, elementInfo, fromCache: false };
    }

    /**
     * 渲染菜谱卡片 HTML
     */
    function renderRecipeCard(recipe, elementInfo) {
        const stepsHtml = recipe.steps
            .map((step, i) => `<li>${i + 1}. ${step}</li>`)
            .join('');

        return `
            <p>根据你「${elementInfo.element}行 · ${elementInfo.organ}」的体质，建议${elementInfo.flavor}味调理：</p>
            <div class="recipe-card">
                <div class="recipe-header">
                    <h4 class="recipe-name">${recipe.name}</h4>
                    <span class="recipe-tag">${elementInfo.element}行推荐</span>
                </div>
                <p class="recipe-effect">功效：${recipe.effect}</p>
                <div class="recipe-ingredients">
                    <span class="label">食材：</span>
                    ${recipe.ingredients.join(' · ')}
                </div>
                <ul class="recipe-steps">${stepsHtml}</ul>
                <a href="${recipe.cps_link}" target="_blank" class="cps-button" onclick="Tracker.track('cps_click')">
                    🎁 领取美团 ¥15 专项红包并下单
                </a>
            </div>
            <p class="disclaimer">⚠️ 以上为 AI 生成的养生建议，不构成医疗诊断。如有不适请就医。</p>
        `;
    }

    return { getRecommendation, renderRecipeCard, getUserElement, ELEMENT_FOOD_MAP };
})();
