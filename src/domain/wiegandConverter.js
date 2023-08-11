module.exports = () => {
  function create(data) {
    // todo 確認 MAX 數量
    const MAX_AMOUNT = 500;
    const wiegandConverters = global.spiderman.db.wiegandconverters.find();
    if (wiegandConverters.length >= MAX_AMOUNT) throw Error(`Items in database has exceeded ${MAX_AMOUNT} (max).`);

    const repeatDevice = global.domain.device.findByName(data.name);
    if (repeatDevice) throw Error(`Name existed. type: ${repeatDevice.type}`);

    data.divice_groups = generateGroups(data.divice_groups);

    global.domain.crud.insertOne({ collection: 'wiegandconverters', data });
  }

  function modify({ uuid, data }) {
    const repeatDevice = global.domain.device.findByName(data.name);
    if (repeatDevice && repeatDevice.uuid !== uuid) throw Error(`Name existed. type: ${repeatDevice.type}`);

    data.divice_groups = generateGroups(data.divice_groups);

    global.domain.crud.modify({
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

  function remove(data) {
    global.domain.crud.handleRelatedUuids({
      collection: 'rules',
      field: 'actions.wiegand_converters',
      uuids: data.uuid,
    });

    global.domain.crud.remove({
      collection: 'wiegandconverters',
      uuid: data.uuid,
    });
  }

  return {
    create,
    modify,
    remove,
  };
};
