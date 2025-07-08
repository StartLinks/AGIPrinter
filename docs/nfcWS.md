# NFC WebSocket Server

一个简化的 WebSocket 服务器，专门用于 NFC Reader 到 NFC Service 的消息传递。

## 功能特性

- **简单的消息转发**：接收来自 NFC Reader 的数据，转发给指定或全部 NFC Service
- **连接管理**：管理多个 WebSocket 连接
- **消息验证**：验证 NFC 消息格式
- **错误处理**：提供清晰的错误信息和回调

## 消息类型

### NFC 数据消息

从 NFC Reader 发送到 NFC Service 的消息格式：

```json
{
  "type": "nfcData",
  "data": {
    "type": "wx_link",
    "data": "7ca13tNTVon"
  },
  "target": "nfcService_test"
}
```

- `data.type`：数据类型（如 wx_link、profie_link 等）
- `data.data`：实际数据内容
- `target`：
  - 为 `nfcService` 时，广播给所有 nfcService 连接
  - 为 `nfcService_xxx` 时，定向发送给指定 nfcService

### 系统回调消息

服务器返回给客户端的确认消息：

```json
{
  "type": "systemCallback",
  "success": true,
  "message": "NFC data sent successfully"
}
```

## Token 说明

所有连接都需要在 WebSocket 头部提供有效的 `token`，格式如下：

- `nfcReader` 或 `nfcService`（无下划线，表示通用连接）
- `nfcReader_xxx` 或 `nfcService_xxx`（带唯一标识符，支持多实例隔离）

### 连接 WebSocket

```javascript
const ws = new WebSocket("wss://nfcws.bonjour.bio", {
  headers: {
    token: "nfcReader", // 或 nfcService_test
  },
});
```

### 发送 NFC 数据

```javascript
const nfcMessage = {
  type: "nfcData",
  data: {
    type: "wx_link",
    data: "7ca13tNTVon",
  },
  target: "nfcService_test", // 或 "nfcService" 广播
};

ws.send(JSON.stringify(nfcMessage));
```

## 工作流程

1. **NFC Reader 连接**：使用有效的 token 连接到 WebSocket 服务器
2. **发送 NFC 数据**：NFC Reader 发送包含卡片信息的消息
3. **消息转发**：服务器验证消息格式，然后转发给目标用户
4. **回调确认**：服务器向 NFC Reader 发送操作结果确认

## 端口配置

默认端口：3000

## 认证

所有连接都需要在 WebSocket 头部提供有效的 `token`，格式见上。
