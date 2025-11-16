// 注意：部署后需替换为你的Render服务地址（步骤五获取）
// 格式：wss://<你的服务名称>.onrender.com （必须用wss协议，Render强制HTTPS）
const ws = new WebSocket('wss://your-websocket-service.onrender.com');

// 以下是原逻辑（无需修改）
ws.onopen = function() {
    console.log('连接服务器成功');
};

ws.onerror = function(error) {
    console.error('连接错误：', error);
    alert('连接服务器失败：error');
};

ws.onmessage = function(event) {
    // 处理收到的消息（原逻辑不变）
    const data = JSON.parse(event.data);
    // ... 你的消息渲染代码 ...
};

// 发送消息的逻辑（原逻辑不变）
function sendMessage() {
    // ... 你的发送代码 ...
}