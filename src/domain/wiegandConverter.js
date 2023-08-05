module.exports = () => {
  async function create(data) {
    // todo 確認 MAX 數量
    const MAX_AMOUNT = 500;
    const wiegandConverters = global.spiderman.db.wiegandconverters.find();
    if (wiegandConverters.length >= MAX_AMOUNT) throw Error(`Items in database has exceeded ${MAX_AMOUNT} (max).`);

    const repeatDevice = global.domain.device.findByName(data.name);
    if (repeatDevice) throw Error(`Name existed. type: ${repeatDevice.type}`);

    data.divice_groups = generateGroups(data.divice_groups);

    await global.domain.crud.insertOne({ collection: 'wiegandconverters', data });
  }

  async function modify({ uuid, data }) {
    const repeatDevice = global.domain.device.findByName(data.name);
    if (repeatDevice && repeatDevice.uuid !== uuid) throw Error(`Name existed. type: ${repeatDevice.type}`);

    data.divice_groups = generateGroups(data.divice_groups);

    await global.domain.crud.modify({
      collection: 'wiegandconverters', uuid, data,
    });
  }

  function generateGroups(uuids) {
    const defaultUUid = '0';
    if (!uuids.includes(defaultUUid)) uuids.push(defaultUUid);

    const result = global.spiderman.db.outputdevicegroups
      .find({ uuid: { $in: uuids } })
      .map(({ uuid }) => uuid);

    return result;
  }

  return {
    create,
    modify,
  };
};