module.exports = () => {
  const client = global.spiderman.udp.create();
  let allWiegandConverters = null;

  function init() {
    allWiegandConverters = global.spiderman.db.wiegandconverters
      .find()
      .map((wiegand) => ({
        ...wiegand,
        sequence: 0,
      }));

    // 定期5秒去 trigger，並讓 sequence 遞增最多至 256
    setInterval(() => {
      allWiegandConverters.forEach((wiegand) => {
        getTrigger({ isTriggerAlive: true, uuid: wiegand.uuid })();
      });
    }, 5000);

    // test trigger
    // setInterval(() => {
    //   allWiegandConverters.forEach((wiegand) => {
    //     getTrigger({ isTriggerAlive: false, uuid: wiegand.uuid })();
    //   });
    // }, 10000);
  }

  function getTrigger({ isTriggerAlive, uuid }) {
    const wiegand = allWiegandConverters.find((w) => w.uuid === uuid);
    if (!wiegand) {
      console.error(`could not find ${uuid} Wiegand converter`);
      return null;
    }

    if (isTriggerAlive) {
      return () => {
        const {
          ip_address: host, port, sequence,
        } = wiegand;

        const command = generateAliveCommand({ sequence });

        send({ command, port, host });

        wiegand.sequence = getNextSequence(sequence);
      };
    }

    return () => {
      const {
        ip_address: host, port, bits, index, syscode, sequence,
      } = wiegand;

      const command = generateCommand({
        sequence, bits, index, syscode,
      });

      send({ command, port, host });

      wiegand.sequence = getNextSequence(sequence);
    };
  }

  function generateAliveCommand({ sequence }) {
    const _sequence = sequence.toString().padStart(3, '0');

    return `${_sequence}Imalive`;
  }

  function generateCommand({
    sequence, bits, index, syscode,
  }) {
    const cardno = 4720864;

    const _sequence = sequence.toString().padStart(3, '0');
    const _bits = bits.toString().padStart(2, '0');
    const _index = index.toString().padStart(2, '0');
    const _syscode = syscode.toString().padStart(3, '0');
    const _cardno = cardno.toString().padStart(13, '0');

    return `${_sequence}Wiegand${_bits}${_index}${_syscode}${_cardno}`;
  }

  function getNextSequence(sequence) {
    if (sequence >= 255) {
      return 0;
    }

    return sequence + 1;
  }

  function send({ command, port, host }) {
    const buffer = Buffer.from(command, 'ascii');

    client.send(buffer, port, host, (err) => {
      if (err) {
        console.error('資料發送失敗：', err);
      } else {
        console.log(`資料已成功發送至 ${host}:${port}， command: ${command} \n`);
      }
    });
  }

  return {
    init,
  };
};
