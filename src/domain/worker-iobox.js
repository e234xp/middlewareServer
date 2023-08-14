module.exports = () => {
  let allIoboxes = [];

  function init() {
    allIoboxes.forEach(({ client }) => {
      client.end();
    });
    allIoboxes = [];

    setTimeout(() => {
      connectIoboxes();
    }, 1000);
  }

  function connectIoboxes() {
    const ioboxes = global.spiderman.db.ioboxes
      .find();

    ioboxes.forEach((iobox) => {
      connect(iobox);
    });
  }

  function connect(io) {
    const { ip_address: host, port } = io;
    global.spiderman.tcp.connect({
      host,
      port,
      onConnect: (client) => {
        const iobox = {
          ...io,
          client,
        };
        allIoboxes.push(iobox);
      },
      onClose: () => {
        // todo 自動恢復連線

      },
    });
  }

  function trigger({ uuid, iopoint }) {
    const { client, iopoint: iopoints } = allIoboxes.find((i) => i.uuid === uuid);

    const { no, trigger: triggerStatus, delay } = iopoints.find((p) => p.no === iopoint);

    const command = generateCommand({ no, status: triggerStatus, delay });

    send({ client, command });
  }

  function generateCommand({ no, status, delay = '' }) {
    status = status ? 1 : 0;
    if (!delay) return `AT+STACH${no}=${status}\n`;

    return `AT+STACH${no}=${status},${delay}\n`;
  }

  function send({ client, command }) {
    const buffer = Buffer.from(command, 'ascii');
    client.write(buffer);
  }

  return {
    init,
    trigger,
  };
};
