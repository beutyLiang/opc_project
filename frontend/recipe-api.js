/**
 * 初序 菜谱推荐引擎
 * 从本地 RECIPE_DATABASE（recipe-data.js）读取50道五行菜谱
 * 支持季节智能匹配 + 随机不重复轮换
 */

const RecipeAPI = (() => {
    // 已推荐记录（避免连续重复）
    const HISTORY_KEY = 'chuxu_recipe_history';
    const MAX_HISTORY = 5; // 记住最近5道，不连续重复

    /**
     * 五行体质 → 元素信息映射
     */
    const ELEMENT_FOOD_MAP = {
        wood: { element: '木', organ: '肝', flavor: '酸', avoid: '辛辣' },
        fire: { element: '火', organ: '心', flavor: '苦', avoid: '大热食物' },
        earth: { element: '土', organ: '脾', flavor: '甘', avoid: '生冷' },
        metal: { element: '金', organ: '肺', flavor: '辛', avoid: '过咸' },
        water: { element: '水', organ: '肾', flavor: '咸', avoid: '甜腻' }
    };

    /**
     * 获取当前季节
     */
    function getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        if (month >= 3 && month <= 5) return '春季';
        if (month >= 6 && month <= 8) return '夏季';
        if (month >= 9 && month <= 11) return '秋季';
        return '冬季';
    }

    /**
     * 获取用户体质（从 localStorage）
     */
    function getUserElement() {
        try {
            const data = JSON.parse(localStorage.getItem('chuxu_constitution'));
            return data ? data.element : 'fire';
        } catch {
            return 'fire';
        }
    }

    /**
     * 获取推荐历史
     */
    function getHistory() {
        try {
            return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        } catch { return []; }
    }

    /**
     * 记录推荐历史
     */
    function addHistory(recipeName) {
        try {
            const history = getHistory();
            history.push(recipeName);
            if (history.length > MAX_HISTORY) history.shift();
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch { /* ignore */ }
    }

    /**
     * 主入口：获取推荐菜谱
     * 优先匹配当前季节，避免连续重复
     */
    async function getRecommendation() {
        const element = getUserElement();
        const elementInfo = ELEMENT_FOOD_MAP[element];
        const season = getCurrentSeason();
        const history = getHistory();

        // 从 RECIPE_DATABASE 获取该体质所有菜谱
        const allRecipes = (typeof RECIPE_DATABASE !== 'undefined' && RECIPE_DATABASE[element])
            ? RECIPE_DATABASE[element]
            : [];

        if (allRecipes.length === 0) {
            // 极端降级
            return {
                recipe: { name: '时令养生粥', effect: '调和五脏，养生保健', ingredients: ['应季食材'], steps: ['选用当季食材煮粥'], cps_link: '#' },
                elementInfo,
                season
            };
        }

        // 优先选当季菜谱，排除最近推荐过的
        const seasonMatch = allRecipes.filter(r =>
            (r.season === season || r.season === '四季' || r.season.includes(season.charAt(0))) &&
            !history.includes(r.name)
        );

        // 如果当季且未重复的菜不够了，放宽到全部未重复的
        const notRepeated = allRecipes.filter(r => !history.includes(r.name));

        // 最终池：当季优先 > 未重复 > 全部
        const pool = seasonMatch.length > 0 ? seasonMatch
            : notRepeated.length > 0 ? notRepeated
                : allRecipes;

        // 随机选一道
        const recipe = pool[Math.floor(Math.random() * pool.length)];
        addHistory(recipe.name);

        return { recipe, elementInfo, season };
    }

    /**
     * 渲染菜谱卡片 HTML
     */
    function renderRecipeCard(recipe, elementInfo) {
        const stepsHtml = recipe.steps
            .map((step, i) => `<li>${i + 1}. ${step}</li>`)
            .join('');

        const seasonTag = recipe.season ? `<span class="recipe-season">${recipe.season}</span>` : '';

        return `
            <p>根据你「${elementInfo.element}行 · ${elementInfo.organ}」的体质，建议${elementInfo.flavor}味调理：</p>
            <div class="recipe-card">
                <div class="recipe-header">
                    <h4 class="recipe-name">${recipe.name}</h4>
                    <span class="recipe-tag">${elementInfo.element}行推荐</span>
                    ${seasonTag}
                </div>
                <p class="recipe-effect">功效：${recipe.effect}</p>
                <div class="recipe-ingredients">
                    <span class="label">食材：</span>
                    ${recipe.ingredients.join(' · ')}
                </div>
                <ul class="recipe-steps">${stepsHtml}</ul>
                <p class="recipe-avoid">⚠️ ${elementInfo.element}行体质应少食${elementInfo.avoid}</p>
                <a href="${recipe.cps_link}" target="_blank" class="cps-button" onclick="Tracker.track('cps_click')">
                    🎁 领取美团 ¥15 专项红包并下单
                </a>
            </div>
            <p class="disclaimer">⚠️ 以上为 AI 生成的养生建议，不构成医疗诊断。如有不适请就医。</p>
        `;
    }

    return { getRecommendation, renderRecipeCard, getUserElement, ELEMENT_FOOD_MAP, getCurrentSeason };
})();
