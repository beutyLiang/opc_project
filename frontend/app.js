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
                label: `${info.element}行 · ${info.organ}体质`,
                timestamp: new Date().toISOString()
            }));

            modal.style.display = 'none';
            updateElementLabel();
            Tracker.track('constitution_completed');

            // 触发 AI 消息推送报告
            if (window.triggerReportMessage) {
                window.triggerReportMessage(element, info);
            }
        };

        modal.style.display = 'flex';
    }

    function updateElementLabel() {
        const result = getResult();
        const label = document.getElementById('user-element-label');
        if (result && label) {
            label.textContent = result.label;
            label.style.cursor = 'pointer';
            label.style.textDecoration = 'underline';
            label.style.textUnderlineOffset = '4px';
            label.title = "点击查看专属体质报告";
            label.onclick = () => {
                window.location.href = `report-preview.html?element=${result.element}`;
            };
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

    // 暴露给外部调用的报告推送
    window.triggerReportMessage = function(element, info) {
        const reportUrl = `report-preview.html?element=${element}`;
        const shopUrl = `shop.html?element=${element}`;
        const htmlContent = `
            <p>测评完成！你属于<strong>${info.element}行·${info.organ}体质</strong>。</p>
            <p>我已经为你生成了包含 <strong>7天定制食谱</strong>、运动建议和茶饮的深度体质报告：</p>
            <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
                <a href="${reportUrl}" style="display:block; text-decoration:none; padding:10px; background:linear-gradient(135deg, #34d399, #2dd4bf); color:#000; border-radius:8px; text-align:center; font-weight:600; font-size: 0.95rem;">
                    📄 查看专属健康报告
                </a>
                <a href="${shopUrl}" style="display:block; text-decoration:none; padding:10px; border:1px solid rgba(52,211,153,0.5); background:rgba(52,211,153,0.05); color:#34d399; border-radius:8px; text-align:center; font-weight:600; font-size: 0.95rem;">
                    🛒 进入养生定制商城
                </a>
            </div>
        `;
        setTimeout(() => {
            showLoading();
            setTimeout(() => {
                hideLoading();
                appendAIMessage(htmlContent);
            }, 1000);
        }, 500);
    };

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

    // === 猜你想问 (Demo Prompts) 多轮剧本引擎 ===
    const scenarios = {
        'demo-scene-1': {
            steps: [
                { type: 'user', text: `下午总是犯困，不知道喝点什么茶回回血，有推荐吗？` },
                { type: 'ai', text: `智远下午好呀~ 根据你上次测出来的‘土型体质’，容易脾胃困湿。你平时是不是还容易觉得嘴巴发黏、身体沉重？` },
                { type: 'user', text: `对，特别明显，而且老想睡觉` },
                { type: 'ai', text: `这确实是典型的湿气表现。建议你这几天可以适当去快走或者慢跑出点汗。另外，非常推荐你在办公室泡一杯【红豆薏米茶】，能健脾祛湿，喝完下午精神会好很多哦！👇`,
                  card: { title: '红豆薏米茶', emoji: '🍵', price: '32.9', url: 'shop.html?element=earth', store: '初序官方商城' }
                }
            ]
        },
        'demo-scene-2': {
            steps: [
                { type: 'user', text: `快到生理期了，情绪特别差，莫名其妙想发火。` },
                { type: 'ai', text: `宝子，这是经前综合征（PMS）很正常的反应哦，由于体内激素水平波动，情绪确实容易失控。不要太苛求自己！抱抱~ ❤️` },
                { type: 'user', text: `有没有什么办法能缓解一下呀？` },
                { type: 'ai', text: `教你三个小妙招：\n1. **泡脚微发汗**：今晚用温水泡脚20分钟，促进血液循环。\n2. **腹式呼吸**：觉得烦躁时，深吸气鼓肚子，慢呼气瘪肚子，做5次。\n3. **饮食调节**：这两天多吃点含镁的食物，比如香蕉、燕麦，能安抚神经。\n\n今天早点休息，什么都别多想，你已经做得很好了！🌸` }
            ]
        },
        'demo-scene-3': {
            steps: [
                { type: 'user', text: `最近秋季干燥，我爸总是干咳，有什么适合长辈的调理建议吗？` },
                { type: 'ai', text: `长辈秋季干咳多是“肺阴不足”引起的。叔叔平时抽烟吗？或者有咽炎史吗？` },
                { type: 'user', text: `他以前抽烟，现在戒了，但咽炎一直有点` },
                { type: 'ai', text: `明白了。那平时一定要嘱咐叔叔多喝温水，可以多买点银耳、百合炖汤喝，润肺化痰。如果想见效快一些，咱们商城的【川贝枇杷膏】特别对症，老字号古法熬制，咱们做儿女的给父母备两瓶，老人家肯定高兴。👇`,
                  card: { title: '川贝枇杷膏', emoji: '🍯', price: '58.0', url: 'shop.html?element=metal', store: '初序官方商城' }
                }
            ]
        },
        'demo-scene-4': {
            steps: [
                // ── Day 1：第一次三餐推荐（纯关怀，零推销）──
                { type: 'ai-system', text: `───── 第 1 天 · 周一 ─────` },
                { type: 'ai', text: `早上好呀~ 根据你的<strong>土型·脾胃体质</strong>，今天给你安排了三餐建议：\n\n🌅 <strong>早餐</strong>：小米南瓜粥 + 水煮蛋\n<em>小米养胃温脾，南瓜补中益气，是你这个体质最好的早餐搭配。</em>\n\n☀️ <strong>午餐</strong>：山药排骨汤 + 清炒西兰花 + 糙米饭\n<em>山药健脾补肺，排骨补钙，中午吃得好下午才不犯困。</em>\n\n🌙 <strong>晚餐</strong>：蒸鲈鱼 + 凉拌木耳 + 红豆薏米粥\n<em>晚上吃清淡点，鲈鱼好消化，薏米祛湿，睡眠也会好。</em>\n\n今天好好吃饭哦~ 🌿` },

                // ── Day 2：用户开始互动 ──
                { type: 'ai-system', text: `───── 第 2 天 · 周二 ─────` },
                { type: 'ai', text: `早安~ 昨天的食谱有试着做吗？今天继续给你安排：\n\n🌅 <strong>早餐</strong>：红枣桂圆糯米粥 + 蒸红薯\n<em>红枣补气，桂圆安神，适合你这种容易乏力的体质。</em>\n\n☀️ <strong>午餐</strong>：番茄牛腩 + 清炒莲藕 + 白米饭\n<em>牛肉补脾胃，番茄开胃，莲藕健脾止泻。</em>\n\n🌙 <strong>晚餐</strong>：丝瓜蛋汤 + 清蒸豆腐 + 杂粮粥\n<em>丝瓜通络化痰，豆腐高蛋白低脂，晚上不给肠胃添负担。</em>` },
                { type: 'user', text: `昨天那个小米南瓜粥我试了，还挺好喝的，今天早上来不及只吃了个包子` },
                { type: 'ai', text: `能试着做就很棒啦！包子也行，主食类的早餐比空腹强太多了。不过你这个体质要少吃凉的和油炸的哦，偶尔赶时间可以前一晚把粥料泡好，早上煮很快的~ 😊` },

                // ── Day 3：用户信任开始建立 ──
                { type: 'ai-system', text: `───── 第 3 天 · 周三 ─────` },
                { type: 'ai', text: `今天立夏啦！节气变化对你的脾胃体质影响挺大的，特别安排了应季食谱：\n\n🌅 <strong>早餐</strong>：莲子百合粥 + 鸡蛋羹\n<em>立夏养心，莲子清心安神，百合润肺。</em>\n\n☀️ <strong>午餐</strong>：冬瓜排骨汤 + 蒜蓉空心菜 + 米饭\n<em>冬瓜利水消暑，夏天脾胃容易受湿，要多吃祛湿食物。</em>\n\n🌙 <strong>晚餐</strong>：清蒸鱼 + 芹菜炒香干 + 绿豆百合汤\n<em>绿豆消暑但偏寒，配上百合就温和多了，很适合你。</em>\n\n⚡ 立夏小贴士：这几天尽量少吃冷饮和生冷瓜果，你的脾胃受不了「冰火两重天」哦~` },
                { type: 'user', text: `我发现你每天推荐的东西都不一样，还考虑了节气，挺用心的` },
                { type: 'ai', text: `哈哈谢谢认可~ 因为每个人体质不一样，同一个人不同季节、不同身体状态需要的饮食也不一样。我会根据你的土型体质特点 + 当前节气 + 你跟我聊到的身体反馈来调整的。\n\n你这几天有没有觉得精神好一点？以前是不是下午特别容易犯困？` },
                { type: 'user', text: `确实，这两天照着吃下午没那么困了，但是晚上有点胀气` },
                { type: 'ai', text: `晚上胀气说明你的脾胃运化能力还是偏弱，可能晚餐吃得有点晚或者吃得太饱了。\n\n建议你：\n1. 晚饭尽量在 <strong>7 点前</strong>吃完\n2. 吃到 <strong>七分饱</strong>就好\n3. 饭后可以揉揉肚子，顺时针 36 圈，帮助消化\n\n明天的食谱我给你调一下，晚餐换成更好消化的~ 🌸` },

                // ── Day 5：用户主动询问 → 自然推荐 ──
                { type: 'ai-system', text: `───── 第 5 天 · 周五 ─────` },
                { type: 'ai', text: `周五啦~ 这周辛苦了！今天给你安排轻松一点的：\n\n🌅 <strong>早餐</strong>：芡实莲子粥 + 煎蛋\n☀️ <strong>午餐</strong>：胡萝卜玉米排骨汤 + 时蔬\n🌙 <strong>晚餐</strong>：南瓜小米粥 + 蒸蛋\n\n周末如果有时间的话，推荐你熬一锅【四神汤】（山药+莲子+茯苓+芡实），这可是土型体质的「黄金调理汤」，喝一周脾胃会舒服很多哦~` },
                { type: 'user', text: `这个四神汤我听说过！但是这些材料要去哪里买比较靠谱？药房还是超市？` },
                { type: 'ai', text: `超市散装的品质参差不齐，药房买虽然靠谱但贵。其实我们初序有一款现成的<strong>「四神汤料包」</strong>，是按道地药食同源标准配比好的，独立小包装，洗都不用洗，直接丢进锅里炖就行~\n\n之所以推荐给你，是因为你这一周跟我聊下来，脾胃虚 + 容易胀气 + 下午犯困这几个表现太典型了，四神汤正好全覆盖。\n\n你要是感兴趣，可以先看看？👇`,
                  card: { title: '四神汤·健脾祛湿料包', emoji: '🍲', price: '39.9', url: 'shop.html?element=earth', store: '初序官方商城' }
                }
            ]
        }
    };

    function renderMiniProgramCard(card) {
        return `
            <a href="${card.url}" class="mini-program-card">
                <div class="mp-header">
                    <span class="mp-icon">🌿</span>
                    <span>${card.store}</span>
                </div>
                <div class="mp-content">
                    <div class="mp-img">${card.emoji}</div>
                    <div class="mp-info">
                        <div class="mp-title">${card.title}</div>
                        <div class="mp-bottom">
                            <span class="mp-price">${card.price}</span>
                            <span class="mp-btn">去购买</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    document.querySelectorAll('.demo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sceneId = e.target.id;
            const scene = scenarios[sceneId];
            if (!scene) return;
            
            // 如果点击的是顶部那几个猜你想问的按钮，先禁用它们防抖
            const originalBtns = document.querySelectorAll('.demo-triggers .demo-btn');
            originalBtns.forEach(b => b.style.pointerEvents = 'none');
            
            let currentStepIndex = 0;

            function runNextStep() {
                if (currentStepIndex >= scene.steps.length) {
                    // 剧本跑完，恢复上方按钮点击
                    originalBtns.forEach(b => b.style.pointerEvents = 'auto');
                    return;
                }
                
                const step = scene.steps[currentStepIndex];
                
                if (step.type === 'ai-system') {
                    const sysDiv = document.createElement('div');
                    sysDiv.style.cssText = 'text-align:center; font-size:12px; color:var(--text-muted); margin:16px 0; font-family:monospace; opacity:0; animation:fadeInUp 0.3s forwards;';
                    sysDiv.innerHTML = `<span>${step.text}</span>`;
                    chatContainer.appendChild(sysDiv);
                    scrollToBottom();
                    currentStepIndex++;
                    setTimeout(runNextStep, 600);
                } else if (step.type === 'user') {
                    if (currentStepIndex === 0 || scene.steps[currentStepIndex - 1].type === 'ai-system') {
                        // 直接渲染而不等待点击
                        appendUserMessage(step.text);
                        currentStepIndex++;
                        runNextStep(); // 接着跑 AI 思考
                    } else {
                        // 生成追问的快捷回复按钮
                        const quickReply = document.createElement('div');
                        quickReply.className = 'quick-reply-wrapper fade-in-up';
                        quickReply.style.cssText = 'display: flex; justify-content: flex-end; margin: 10px 0;';
                        quickReply.innerHTML = `<button class="demo-btn" style="background:var(--primary-color, #00d2ad); color:#000; border:none; padding:8px 16px; font-weight:600; box-shadow: 0 4px 12px rgba(0, 210, 173, 0.3);">${step.text}</button>`;
                        chatContainer.appendChild(quickReply);
                        scrollToBottom();

                        quickReply.querySelector('button').onclick = () => {
                            quickReply.remove();
                            appendUserMessage(step.text);
                            currentStepIndex++;
                            runNextStep(); 
                        };
                    }
                } else if (step.type === 'ai') {
                    showLoading();
                    setTimeout(() => {
                        hideLoading();
                        
                        // 处理可能存在的换行
                        const formattedText = step.text.replace(/\n/g, '<br>');
                        let htmlContent = `<p style="margin-bottom:8px;">${formattedText}</p>`;
                        if (step.card) {
                            htmlContent += renderMiniProgramCard(step.card);
                        }
                        appendAIMessage(htmlContent);
                        
                        currentStepIndex++;
                        if (currentStepIndex < scene.steps.length) {
                            runNextStep();
                        } else {
                            // 结束
                            originalBtns.forEach(b => b.style.pointerEvents = 'auto');
                        }
                    }, 1200);
                }
            }

            runNextStep();
        });
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
