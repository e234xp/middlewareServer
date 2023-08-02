const dgram = require('dgram');

// todo
module.exports = () => {
  function create() {
    // 建立 TCP 連線
    const client = dgram.createSocket('udp4');

    return client;
  }

  return {
    create,
  };
};
