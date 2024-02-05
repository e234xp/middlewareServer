module.exports = () => {
  function init() {
    const receivePort = 2221;

    const server = global.spiderman.udp.create();

    server.on('listening', () => {
      const address = server.address();
      console.log(`接收伺服器正在監聽 camerastatus ${address.address}:${address.port}`);
    });

    server.on('message', (msg) => {
      const camerasStatus = [];
      // const totalLen = Number(msg.readUInt32LE(0));
      let currentPos = 4;
      while (msg.length > currentPos) {
        const mediaAlive = Number(msg.readUInt32LE(currentPos));
        currentPos += 4;
        const mediaIdLen = Number(msg.readUInt32LE(currentPos));
        currentPos += 4;
        const mediaId = msg.toString('utf8', currentPos, currentPos + mediaIdLen);
        currentPos += mediaIdLen;

        camerasStatus.push({
          uuid: mediaId,
          alive: (mediaAlive === 1),
          timestamp: Date.now(),
        });
      }

      // { uuid: '3b17203c-cdb5-4bdb-8807-1c937be3c8b3', alive: true },

      global.runtimcache.camerasStatus = camerasStatus;

      // console.log('camerasStatus', global.runtimcache.camerasStatus);
    });
    server.bind(receivePort);
  }

  return {
    init,
  };
};
