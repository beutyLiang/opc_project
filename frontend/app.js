/**
 * 初序 Web PWA 核心交互逻辑 V2.0
 * XSS 安全、数据追踪、体质选择、A/B 对话路径
 */

/* ─── 数据追踪桩 ─── */
const Tracker = (() => {
    const KEY = 'chuxu_tracker';

    function _get() {
        try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
        catch { return {}; }
    }

    function track(event) {
        const data = _get();
        data[event] = (data[event] || 0) + 1;
        data.last_active = new Date().toISOString();
        localStorage.setItem(KEY, JSON.stringify(data));
    }

    function getStats() { return _get(); }

    return { track, getStats };
})();

/* ─── XSS 安全工具 ─── */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ─── 体质选择弹窗 ─── */
const ConstitutionModal = (() => {
    const STORAGE_KEY = 'chuxu_constitution';

    const questions = [
        {
            q: '你最近容易出现哪种不适？',
            options: [
                { label: '😤 易怒、眼干、头痛', value: 'wood' },
                { label: '😰 心慌、失眠、口干', value: 'fire' },
                { label: '😩 腹胀、食欲差、乏力', value: 'earth' },
                { label: '🤧 咳嗽、皮肤干、鼻塞', value: 'metal' },
                { label: '😴 腰酸、怕冷、夜尿多', value: 'water' }
            ]
        },
        {
            q: '你偏好哪类食物？',
            options: [
                { label: '🍋 酸味（柠檬、醋）', value: 'wood' },
                { label: '🍵 苦味（苦瓜、绿茶）', value: 'fire' },
                { label: '🍠 甜味（红薯、南瓜）', value: 'earth' },
                { label: '🌶️ 辛味（姜、蒜）', value: 'metal' },
                { label: '🧂 咸味（海带、紫菜）', value: 'water' }
            ]
        },
        {
            q: '哪个季节你状态最差？',
            options: [
                { label: '🌱 春天', value: 'wood' },
                { label: '☀️ 夏天', value: 'fire' },
                { label: '🍂 换季时', value: 'earth' },
                { label: '🍁 秋天', value: 'metal' },
                { label: '❄️ 冬天', value: 'water' }
            ]
        }
    ];

    let answers = [];

    function isCompleted() {
        return localStorage.getItem(STORAGE_KEY) !== null;
    }

    function getResult() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
        catch { return null; }
    }

    function show() {
        const modal = document.getElementById('constitution-modal');
        const container = document.getElementById('constitution-questions');
        const submitBtn = document.getElementById('constitution-submit');
        answers = [];

        container.innerHTML = questions.map((item, qi) => `
            <div class="cq-block">
                <p class="cq-question">${qi + 1}. ${item.q}</p>
                <div class="cq-options">
                    ${item.options.map((opt, oi) => `
                        <label class="cq-option">
                            <input type="radio" name="cq-${qi}" value="${opt.value}" data-qi="${qi}">
                            <span>${opt.label}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');

        container.addEventListener('change', () => {
            const checked = container.querySelectorAll('input[type="radio"]:checked');
            answers = Array.from(checked).map(r => r.value);
            submitBtn.disabled = answers.length < questions.length;
        });

        submitBtn.onclick = () => {
            // 取多数出现的元素
            const counts = {};
            answers.forEach(a => counts[a] = (counts[a] || 0) + 1);
            const element = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
            const info = RecipeAPI.ELEMENT_FOOD_MAP[element];

            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                element,
                label: `${info.element}行 · ${info.organ}`,
                timestamp: new Date().toISOString()
            }));

            modal.style.display = 'none';
            updateElementLabel();
            Tracker.track('constitution_completed');
        };

        modal.style.display = 'flex';
    }

    function updateElementLabel() {
        const result = getResult();
        const label = document.getElementById('user-element-label');
        if (result && label) {
            label.textContent = result.label;
        }
    }

    return { isCompleted, show, updateElementLabel, getResult };
})();

/* ─── 主应用逻辑 ─── */
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const btnEatWhat = document.getElementById('btn-eat-what');
    const btnAssessment = document.getElementById('btn-assessment');

    // 首次访问弹出体质选择
    if (!ConstitutionModal.isCompleted()) {
        setTimeout(() => ConstitutionModal.show(), 800);
    } else {
        ConstitutionModal.updateElementLabel();
    }

    /**
     * 渲染用户消息（XSS 安全）
     */
    function appendUserMessage(text) {
        if (!text.trim()) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message fade-in-up';

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const p = document.createElement('p');
        p.textContent = text; // textContent 防 XSS
        bubble.appendChild(p);
        msgDiv.appendChild(bubble);

        chatContainer.appendChild(msgDiv);
        scrollToBottom();
        Tracker.track('message_sent');
    }

    /**
     * 渲染 AI 回复（HTML 内容，来自受信任的内部模板）
     */
    function appendAIMessage(htmlContent) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ai-message fade-in-up';
        msgDiv.innerHTML = `
            <div class="avatar">序</div>
            <div class="bubble">${htmlContent}</div>
        `;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    /**
     * 显示 Loading 指示器
     */
    function showLoading() {
        const loader = document.createElement('div');
        loader.className = 'message ai-message fade-in';
        loader.id = 'loading-indicator';
        loader.innerHTML = `
            <div class="avatar">序</div>
            <div class="bubble">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        chatContainer.appendChild(loader);
        scrollToBottom();
    }

    function hideLoading() {
        const loader = document.getElementById('loading-indicator');
        if (loader) loader.remove();
    }

    function scrollToBottom() {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
    }

    // 事件：今天吃什么
    btnEatWhat.addEventListener('click', async () => {
        appendUserMessage('帮我推荐今天吃什么？');
        showLoading();
        Tracker.track('eat_what_click');

        try {
            const { recipe, elementInfo } = await RecipeAPI.getRecommendation();
            hideLoading();
            const cardHtml = RecipeAPI.renderRecipeCard(recipe, elementInfo);
            appendAIMessage(cardHtml);
        } catch (err) {
            hideLoading();
            appendAIMessage('<p>抱歉，获取推荐时出了点问题，请稍后再试。</p>');
            console.error('[初序] 菜谱获取失败:', err);
        }
    });

    // 事件：五行测评 → 跳转扣子 Bot
    btnAssessment.addEventListener('click', () => {
        Tracker.track('assessment_click');
        // 跳转扣子 Bot 分享链接（Zoey 提供真实链接后替换）
        window.open('https://www.coze.cn/s/placeholder', '_blank');
    });

    // 事件：发送文本消息
    const handleSend = () => {
        const text = userInput.value;
        if (!text.trim()) return;

        appendUserMessage(text);
        userInput.value = '';
        showLoading();

        // 创建 AI 消息气泡（流式填充内容）
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ai-message fade-in-up';
        const contentP = document.createElement('p');
        msgDiv.innerHTML = '<div class="avatar">序</div>';
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.appendChild(contentP);
        msgDiv.appendChild(bubble);

        let streamStarted = false;

        ChatEngine.send(
            text,
            // onChunk：流式逐字输出
            (chunk, fullSoFar) => {
                if (!streamStarted) {
                    hideLoading();
                    chatContainer.appendChild(msgDiv);
                    streamStarted = true;
                }
                contentP.textContent = fullSoFar;
                scrollToBottom();
            },
            // onDone：完成
            (fullContent) => {
                if (!streamStarted) {
                    hideLoading();
                    chatContainer.appendChild(msgDiv);
                }
                contentP.textContent = fullContent;
                // 追加免责声明
                const disclaimer = document.createElement('p');
                disclaimer.className = 'disclaimer';
                disclaimer.textContent = '⚠️ 以上为 AI 生成的养生建议，不构成医疗诊断。如有不适请就医。';
                bubble.appendChild(disclaimer);
                scrollToBottom();
                Tracker.track('ai_response_received');
            },
            // onError：失败
            (err) => {
                hideLoading();
                if (!streamStarted) {
                    chatContainer.appendChild(msgDiv);
                }
                contentP.textContent = '抱歉，初序引擎暂时无法连接，请稍后再试 🌿';
                scrollToBottom();
                console.error('[初序] AI 对话失败:', err);
                Tracker.track('ai_response_error');
            }
        );
    };

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
