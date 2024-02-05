const WebSocket = require('ws');
const { uuid: uuidv4 } = require('uuidv4');

module.exports = () => {
  function create({ server, path, noServer } = {}) {
    // if (!server || !path) throw new Error('server and path are required');

    const socketServer = new WebSocket.Server({ server, path, noServer });
    socketServer.connectedClients = new Map();

    socketServer.on('connection', (ws) => {
      const id = uuidv4();

      console.log('New connection from ws remoteAddress', ws._socket.remoteAddress, id);
      socketServer.connectedClients.set(id, ws);

      ws.on('message', (message) => {
        const client = socketServer.connectedClients.get(id);

        console.log('message remoteAddress', client._socket.remoteAddress);
        console.log('message', message);

        ws.send(`response: ${message}`);

        return false;
      });

      ws.on('error', (error) => {
        const client = socketServer.connectedClients.get(id);

        console.log('error remoteAddress', client._socket.remoteAddress, error);
      });

      ws.on('close', (code, reason) => {
        const client = socketServer.connectedClients.get(id);
        console.log('close remoteAddress', client._socket.remoteAddress, code, reason);
        socketServer.connectedClients.delete(id);
      });

      ws.send(`id:${id} remoteAddress:${ws._socket.remoteAddress}`);
    });

    return socketServer;
  }

  function broadcastMessage({ wss, message }) {
    if (wss) {
      wss.connectedClients.forEach((value) => {
        // console.log('broadcastMessage', value._socket.remoteAddress, message.substr(0, 100));
        value.send(message);
      });
    }
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
