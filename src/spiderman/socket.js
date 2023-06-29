const WebSocket = require('ws');

module.exports = () => {
  function create({ server, path } = {}) {
    if (!server || !path) throw new Error('server and path are required');

    const wss = new WebSocket.Server({ server, path });
    wss.connectedClients = new Map();

    wss.on('connection', (ws) => {
      console.log('connection');
      const id = Array.from(wss.connectedClients.values()).length;
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

    clients.forEach((client) => {
      client.send(message);
    });
  }

  return {
    create,
    broadcastMessage,
  };
};
