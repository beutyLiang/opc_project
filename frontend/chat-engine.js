/**
 * 初序 AI 对话引擎
 * 支持 A/B 双路径：OpenClaw Daemon (SSE) / Coze Fallback
 * 包含流式打字机效果 + 非流式降级
 */

const ChatEngine = (() => {
    /* ─── 配置 ─── */
    const CONFIG = {
        // A路径：凯撒的 OpenClaw Daemon（Spike 已验证通过）
        // 部署后替换为 Lighthouse 地址，如 https://your-server.com
        // OpenClaw 服务地址
        OPENCLAW_BASE: 'http://localhost:8000',
        OPENCLAW_ENDPOINT: '/v1/chat/completions',

        // B路径：Coze 直连 Fallback（Spike 失败时启用）
        COZE_BASE: 'https://api.coze.cn',
        COZE_BOT_ID: '',       // Zoey 提供
        COZE_PAT: '',          // Zoey 提供

        // 当前模式：'openclaw' | 'coze'
        MODE: 'openclaw',

        // 模型名（OpenClaw Daemon 里配置的）
        MODEL: 'chuxu',

        // 超时（毫秒）
        TIMEOUT: 30000,

        // 系统提示词：带入五行体质上下文
        getSystemPrompt: () => {
            const constitution = JSON.parse(localStorage.getItem('chuxu_constitution') || 'null');
            const elementContext = constitution
                ? `用户的五行体质是「${constitution.label}」，请基于此体质给出个性化的健康建议。`
                : '用户尚未完成体质测评，请先给出通用的健康养生建议。';

            return `你是"初序"——一个专业的中医五行健康调养 AI 助手。${elementContext}
回答要求：
1. 简洁实用，不超过 200 字
2. 结合五行理论和现代营养学
3. 给出可操作的具体建议
4. 语气温暖但专业
5. 必须附上免责声明：此为 AI 生成的养生建议，不构成医疗诊断`;
        }
    };

    // 对话历史（最多保留最近 6 轮）
    let conversationHistory = [];
    const MAX_HISTORY = 12; // 6 轮 = 12 条消息

    /**
     * 添加消息到历史
     */
    function addToHistory(role, content) {
        conversationHistory.push({ role, content });
        if (conversationHistory.length > MAX_HISTORY) {
            conversationHistory = conversationHistory.slice(-MAX_HISTORY);
        }
    }

    /**
     * 构建请求 Messages 数组
     */
    function buildMessages(userMessage) {
        return [
            { role: 'system', content: CONFIG.getSystemPrompt() },
            ...conversationHistory,
            { role: 'user', content: userMessage }
        ];
    }

    /**
     * A 路径：OpenClaw Daemon（OpenAI 兼容协议）
     * 优先尝试 SSE 流式，失败则降级为非流式
     */
    async function chatViaOpenClaw(userMessage, onChunk, onDone, onError) {
        const messages = buildMessages(userMessage);
        addToHistory('user', userMessage);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

        try {
            // 先尝试流式
            const response = await fetch(`${CONFIG.OPENCLAW_BASE}${CONFIG.OPENCLAW_ENDPOINT}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: CONFIG.MODEL,
                    messages,
                    stream: true
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // SSE 流式解析
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullContent += delta;
                            onChunk(delta, fullContent);
                        }
                    } catch { /* 忽略解析错误 */ }
                }
            }

            addToHistory('assistant', fullContent);
            onDone(fullContent);

        } catch (err) {
            clearTimeout(timeoutId);

            // 流式失败，降级为非流式
            if (err.name !== 'AbortError') {
                console.warn('[初序] 流式失败，降级为非流式:', err.message);
                try {
                    await chatViaOpenClawNonStream(userMessage, onChunk, onDone, onError);
                    return;
                } catch (fallbackErr) {
                    onError(fallbackErr);
                    return;
                }
            }
            onError(err);
        }
    }

    /**
     * A 路径降级：非流式 + 伪打字机
     */
    async function chatViaOpenClawNonStream(userMessage, onChunk, onDone, onError) {
        const messages = buildMessages(userMessage);

        const response = await fetch(`${CONFIG.OPENCLAW_BASE}${CONFIG.OPENCLAW_ENDPOINT}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages,
                stream: false
            })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答。';

        addToHistory('assistant', content);

        // 伪打字机效果：逐字渲染
        await typewriterEffect(content, onChunk);
        onDone(content);
    }

    /**
     * B 路径：Coze 直连 Fallback
     */
    async function chatViaCoze(userMessage, onChunk, onDone, onError) {
        addToHistory('user', userMessage);

        try {
            const response = await fetch(`${CONFIG.COZE_BASE}/v3/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.COZE_PAT}`
                },
                body: JSON.stringify({
                    bot_id: CONFIG.COZE_BOT_ID,
                    user_id: 'pwa-user',
                    additional_messages: [
                        { role: 'user', content: userMessage, content_type: 'text' }
                    ],
                    stream: false
                })
            });

            if (!response.ok) throw new Error(`Coze API ${response.status}`);

            const data = await response.json();
            const content = data.messages?.find(m => m.role === 'assistant')?.content
                || '抱歉，暂时无法连接初序引擎。';

            addToHistory('assistant', content);
            await typewriterEffect(content, onChunk);
            onDone(content);

        } catch (err) {
            onError(err);
        }
    }

    /**
     * 伪打字机效果
     */
    function typewriterEffect(text, onChunk) {
        return new Promise(resolve => {
            let i = 0;
            const chars = [...text]; // 支持 emoji
            const interval = setInterval(() => {
                if (i >= chars.length) {
                    clearInterval(interval);
                    resolve();
                    return;
                }
                // 每次输出 1-3 个字符，模拟真实打字节奏
                const chunkSize = Math.min(Math.ceil(Math.random() * 3), chars.length - i);
                const chunk = chars.slice(i, i + chunkSize).join('');
                i += chunkSize;
                onChunk(chunk, text.slice(0, i));
            }, 30);
        });
    }

    /**
     * 主入口：发送消息
     */
    async function send(userMessage, onChunk, onDone, onError) {
        const chatFn = CONFIG.MODE === 'coze' ? chatViaCoze : chatViaOpenClaw;
        await chatFn(userMessage, onChunk, onDone, onError);
    }

    /**
     * 切换模式
     */
    function setMode(mode) {
        if (mode === 'openclaw' || mode === 'coze') {
            CONFIG.MODE = mode;
            console.log(`[初序] 对话模式切换为: ${mode}`);
        }
    }

    /**
     * 重置对话历史
     */
    function clearHistory() {
        conversationHistory = [];
    }

    return { send, setMode, clearHistory, CONFIG };
})();
