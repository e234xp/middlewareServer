module.exports = () => {
  // todo 會改為利用 UDP 收 result
  function init() {
    const nonrecognizedUrl = 'ws://192.168.10.161/fcsnonrecognizedresult';
    global.spiderman.socket.connect({
      url: nonrecognizedUrl,
      onMessage: (client, data) => {
        console.log('Non recognized result');
        onMessage(client, data);
      },
    });

    const recognizedUrl = 'ws://192.168.10.161/fcsrecognizedresult';
    global.spiderman.socket.connect({
      url: recognizedUrl,
      onMessage: (client, data) => {
        console.log('Recognized result');
        onMessage(client, data);
      },
    });

    function onMessage(client, data) {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
    }
  }

  return {
    init,
  };
};
