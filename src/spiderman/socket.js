const WebSocket = require('ws');
const { uuid: uuidv4 } = require('uuidv4');

module.exports = () => {
  function create({ server, path } = {}) {
    if (!server || !path) throw new Error('server and path are required');

    const wss = new WebSocket.Server({ server, path });
    wss.connectedClients = new Map();

    wss.on('connection', (ws) => {
      console.log('connection');

      const id = uuidv4();
      wss.connectedClients.set(id, ws);

      ws.on('message', (message) => {
        console.log('get message:', message);

        ws.send(`response: ${message}`);
      });

      ws.on('close', () => {
        console.log('close');
        wss.connectedClients.delete(id);
      });
    });

    return wss;
  }

  function broadcastMessage({ wss, message }) {
    const clients = Array.from(wss.connectedClients.values());

    console.log(clients.length);
    clients.forEach((client) => {
      client.send(message);
    });
  }

  function connect({
    url, onOpen = () => { }, onMessage = () => { }, onClose = () => { }, onError = () => { },

  }) {
    // 建立 WebSocket 連線
    const client = new WebSocket(url);

    // 監聽連線成功事件
    client.on('open', () => {
      console.log(`WebSocket connected ${url}`);
      onOpen(client);
    });

    // 監聽來自 WebSocket 伺服器的訊息
    client.on('message', (data) => {
      console.log('WebSocket response');
      onMessage(client, data);
    });

    // 監聽連線關閉事件
    client.on('close', () => {
      console.log('WebSocket closed');
      onClose(client);
    });

    // 監聽連線錯誤事件
    client.on('error', (err) => {
      console.error('WebSocket error', err);
      onError(client);
    });

    return client;
  }

  return {
    create,
    broadcastMessage,
    connect,
  };
};
