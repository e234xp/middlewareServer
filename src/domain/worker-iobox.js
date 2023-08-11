module.exports = () => {
  let allIoboxes = null;

  function init() {
    const ioboxes = global.spiderman.db.ioboxes.find();
    const result = [];

    ioboxes.forEach((iobox) => {
      const { ip_address: host, port } = iobox;
      global.spiderman.tcp.connect({
        host,
        port,
        onConnect: (client) => {
          result.push(
            {
              ...iobox,
              client,
            },
          );
        },
      });
    });

    allIoboxes = result;
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
