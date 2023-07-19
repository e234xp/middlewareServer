module.exports = () => {
  async function create(data) {
    // todo 確認 MAX 數量
    const MAX_ROI = 5;
    const { roi } = data;
    if (roi.length > MAX_ROI) throw Error(`Roi number has exceeded ${MAX_ROI} (max).`);

    // todo 確認 MAX 數量
    const MAX_AMOUNT = 500;
    const cameras = global.spiderman.db.cameras.find();
    if (cameras.length >= MAX_AMOUNT) throw Error(`Items in database has exceeded ${MAX_AMOUNT} (max).`);

    const repeatDevice = global.domain.device.findByName(data.name);
    if (repeatDevice) throw Error(`Name existed. type: ${repeatDevice.type}`);

    await global.domain.crud.insertOne({ collection: 'cameras', data });
  }

  async function modify({ uuid, data }) {
    const MAX_ROI = 5;
    const { roi } = data;
    if (roi.length > MAX_ROI) throw Error(`Roi number has exceeded ${MAX_ROI} (max).`);

    const repeatDevice = global.domain.device.findByName(data.name);
    if (repeatDevice && repeatDevice.uuid !== uuid) throw Error(`Name existed. type: ${repeatDevice.type}`);

    await global.domain.crud.modify({
      collection: 'cameras', uuid, data,
    });
  }

  return {
    create,
    modify,
  };
};
