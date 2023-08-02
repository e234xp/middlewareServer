module.exports = () => {
  let allWiegandConverters = null;
  const client = global.spiderman.udp.create();

  function init() {
    allWiegandConverters = global.spiderman.db.wiegandconverters.find();

    // todo test trigger
    // const { uuid } = allWiegandConverters[0];
    // trigger(uuid);
  }

  function trigger(uuid) {
    const {
      ip_address: host, port, bits, index, syscode,
    } = allWiegandConverters.find((wiegand) => wiegand.uuid === uuid);

    const command = generateCommand({ bits, index, syscode });
    send({ command, port, host });
  }

  function generateCommand({ bits, index, syscode }) {
    const cardno = 4720864;

    const _seq = '00';
    const _bits = bits.toString().padStart(2, '0');
    const _idx = index.toString().padStart(2, '0');
    const _sys = syscode.toString().padStart(3, '0');
    const _cardno = cardno.toString().padStart(13, '0');

    return `${_seq}Wiegand${_bits}${_idx}${_sys}${_cardno}`;
  }

  function send({ command, port, host }) {
    const buffer = Buffer.from(command, 'ascii');

    client.send(buffer, port, host, (err) => {
      if (err) {
        console.error('資料發送失敗：', err);
      } else {
        console.log(`資料已成功發送至 ${host}:${port}`);
      }
    });
  }

  return {
    init,
    trigger,
  };
};
