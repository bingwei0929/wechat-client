// 获取DOM元素
const usernameInput = document.getElementById('username');
const joinBtn = document.getElementById('join-btn');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages');

// 关键修改：使用 Render 后端的 wss 协议地址（替换为你的 Render 服务地址）
const ws = new WebSocket('wss://你的服务名.onrender.com');

// 存储当前用户
let currentUser = null;

// WebSocket连接成功
ws.onopen = () => {
    console.log('✅ 已连接到 Render 服务器');
    addMessage('系统', '已连接到聊天服务器，可以开始聊天了', 'system');
};

// WebSocket连接错误
ws.onerror = (event) => {
    const errorMsg = event.message || event.type || "未知错误";
    alert(`❌ 连接服务器失败：${errorMsg}\n请确认：\n1. Render 服务状态为 "Live"\n2. WebSocket 地址正确`);
    console.error('连接错误：', event);
};

// WebSocket连接关闭
ws.onclose = (event) => {
    alert(`⚠️ 与服务器的连接已断开（代码：${event.code}）\n请刷新页面重新连接`);
};

// 收到服务器消息
ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        addMessage(data.username, data.text, 'other');
    } catch (e) {
        console.error('解析消息失败：', e);
    }
};

// 加入聊天按钮点击事件
joinBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        currentUser = username;
        usernameInput.disabled = true;
        joinBtn.disabled = true;
        messageInput.disabled = false;
        sendBtn.disabled = false;
        messageInput.focus();
        addMessage('系统', `${username} 加入了聊天`, 'system');
    } else {
        alert('请输入昵称后再加入聊天');
    }
});

// 发送消息按钮点击事件
sendBtn.addEventListener('click', sendMessage);

// 输入框回车发送
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// 发送消息函数
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return; // 空消息不发送

    if (!currentUser) {
        alert('请先输入昵称并点击"加入聊天"');
        return;
    }

    if (ws.readyState !== WebSocket.OPEN) {
        alert('尚未连接到服务器，请稍候重试');
        return;
    }

    // 显示自己的消息
    addMessage(currentUser, text, 'user');
    // 发送给服务器
    ws.send(JSON.stringify({ username: currentUser, text: text }));
    // 清空输入框
    messageInput.value = '';
}

// 添加消息到界面
function addMessage(username, text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;

    const metaDiv = document.createElement('div');
    metaDiv.className = 'message-meta';
    const time = new Date().toLocaleTimeString();
    metaDiv.textContent = `${username} · ${time}`;

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(metaDiv);
    messagesContainer.appendChild(messageDiv);
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}