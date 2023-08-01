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

  function trigger(uuid) {
    const { client, iopoint } = allIoboxes.find((iobox) => iobox.uuid === uuid);

    const commands = iopoint
      .filter(({ enable }) => !!enable)
      .map(({
        no, trigger: triggerStatus, delay,
      }) => generateCommand({ no, status: triggerStatus, delay }));

    commands.forEach((command) => {
      send({ client, command });
    });
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
