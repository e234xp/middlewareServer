module.exports = () => {
  const url = 'ws://192.168.10.161/fcsrecognizedresult';
  global.spiderman.socket.connect({
    url,
    onMessage,
  });

  function onMessage(client, data) {
    // console.log(data);
  }
};
