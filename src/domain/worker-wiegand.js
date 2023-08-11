module.exports = () => {
  let allWiegandConverters = [];

  function init() {
    allWiegandConverters.forEach(({ client }) => {
      client.end();
    });

    setTimeout(() => {
      connectWiegandConverters();
    }, 1000);
  }

  function connectWiegandConverters() {
    const wiegandConverters = global.spiderman.db.wiegandconverters
      .find();

    const result = [];

    wiegandConverters.forEach((w) => {
      const { ip_address: host, port } = w;
      global.spiderman.tcp.connect({
        host,
        port,
        onConnect: (client) => {
          const wiegand = {
            ...w,
            client,
            sequence: 0,
            lastSendTimestamp: null,
          };
          result.push(wiegand);

          send({ wiegand, isSendAlive: true });
          setInterval(() => {
            send({ wiegand, isSendAlive: true });
          }, 8 * 1000);
        },
      });
    });

    allWiegandConverters = result;
  }

  function trigger({ uuid, isSpecialCardNumber, cardNumber }) {
    const wiegand = allWiegandConverters.find((w) => w.uuid === uuid);
    if (!wiegand) {
      console.error(`could not find ${uuid} Wiegand converter`);
      return;
    }

    const sendCardNumber = isSpecialCardNumber ? wiegand.special_card_number : cardNumber;
    if (!sendCardNumber) return;

    send({ wiegand, isSendAlive: false, cardNumber: sendCardNumber });
  }

  function send({ wiegand, isSendAlive = true, cardNumber }) {
    const now = Date.now();
    if (wiegand.lastSendTimestamp && now - wiegand.lastSendTimestamp < 1000) {
      setTimeout(() => {
        send({ wiegand, isSendAlive, cardNumber });
      }, 1 * 1000);
      return;
    }

    const command = (() => {
      const {
        sequence, bits, index, syscode,
      } = wiegand;

      if (isSendAlive) return generateAliveCommand(sequence);
      return generateCommand({
        sequence, bits, index, syscode, cardNumber,
      });
    })();

    const buffer = Buffer.from(command, 'ascii');
    wiegand.client.write(buffer);
    wiegand.lastSendTimestamp = Date.now();
    wiegand.sequence = getNextSequence(wiegand.sequence);
    console.log('send', command);
  }

  function generateCommand({
    sequence, bits, index, syscode, cardNumber,
  }) {
    const _sequence = sequence.toString().padStart(3, '0');
    const _bits = bits.toString().padStart(2, '0');
    const _index = index.toString().padStart(2, '0');
    const _syscode = syscode.toString().padStart(3, '0');
    const _cardno = cardNumber.toString().padStart(12, '0');

    return `${_sequence}Wiegand${_bits}${_index}${_syscode}${_cardno}`;
  }

  function generateAliveCommand(sequence) {
    const _sequence = sequence.toString().padStart(3, '0');

    return `${_sequence}Imalive`;
  }

  function getNextSequence(sequence) {
    if (sequence >= 255) {
      return 0;
    }

    return sequence + 1;
  }

  return {
    init,
    trigger,
  };
};
