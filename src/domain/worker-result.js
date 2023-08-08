module.exports = () => {
  function init() {
    const receivePort = 9000;

    const server = global.spiderman.udp.create();

    server.on('listening', () => {
      const address = server.address();
      console.log(`接收伺服器正在監聽 ${address.address}:${address.port}`);
    });

    server.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      // console.log('get verify result', parsedMessage.source_id);
      // todo
    });

    server.bind(receivePort);
  }

  return {
    init,
  };
};
