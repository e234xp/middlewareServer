module.exports = () => {
  const url = 'ws://192.168.10.161/fcsnonrecognizedresult';
  global.spiderman.socket.connect({
    url,
    onMessage,
  });

  function onMessage(client, data) {
    // console.log(data);
  }
};
