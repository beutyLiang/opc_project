/**
 * 初序 Web PWA 核心交互逻辑
 * 完全使用单一原生 JS 实现，符合轻量化与快速测试原则
 */

document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const btnEatWhat = document.getElementById('btn-eat-what');

    /**
     * 渲染用户发出的消息
     */
    function appendUserMessage(text) {
        if (!text.trim()) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message fade-in-up';
        msgDiv.innerHTML = `
            <div class="bubble">
                <p>${text}</p>
            </div>
        `;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    /**
     * 渲染 AI 回复的消息 (模拟打字加载效果)
     */
    function appendAIMessage(htmlContent) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ai-message fade-in-up';
        msgDiv.innerHTML = `
            <div class="avatar">序</div>
            <div class="bubble">
                ${htmlContent}
            </div>
        `;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    /**
     * 滚动到底部
     */
    function scrollToBottom() {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }

    // 事件：点击“今天吃什么”
    btnEatWhat.addEventListener('click', () => {
        appendUserMessage("帮我推荐今天午餐吃什么？");
        
        // 模拟网络请求延迟
        setTimeout(() => {
            // 这里将是与轨道B 天行数据API对接的真实返回结果Mock
            const mockRecipeCard = `
                <p>根据你「肝火偏旺」的体质，中午建议清淡降火：</p>
                <div style="margin-top: 12px; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border: 1px solid var(--glass-border);">
                    <h4 style="color: var(--primary-color); margin-bottom: 6px;">苦瓜酿肉</h4>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">功效：清热解毒，养肝平气。</p>
                    <a href="#" style="display: block; text-align: center; background: linear-gradient(90deg, #ff4e50, #f9d423); color: white; text-decoration: none; padding: 8px; border-radius: 6px; font-weight: 500; font-size: 0.9rem;">
                        🎁 领取美团 ¥15 专项红包并下单
                    </a>
                </div>
            `;
            appendAIMessage(mockRecipeCard);
        }, 800);
    });

    // 事件：发送文本消息
    const handleSend = () => {
        const text = userInput.value;
        if(text) {
            appendUserMessage(text);
            userInput.value = '';
            
            // 兜底通用回复
            setTimeout(() => {
                appendAIMessage('<p>初序正在接入主认知引擎，请稍候...</p>');
            }, 600);
        }
    };

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') handleSend();
    });
});
