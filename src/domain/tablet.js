module.exports = () => {
  async function create(data) {
    // todo 確認 MAX 數量
    const MAX_AMOUNT = 500;
    const cameras = global.spiderman.db.cameras.find();
    if (cameras.length >= MAX_AMOUNT) throw Error(`Items in database has exceeded ${MAX_AMOUNT} (max).`);

    data.divice_groups = generateGroups(data.divice_groups);
    data.group_list_to_pass = generatePersonGroups(data.group_list_to_pass);

    global.domain.crud.insertOne({
      collection: 'tablets',
      data,
      uniqueKeys: ['name', 'identity', 'ip_address', 'code'],
    });
  }

  async function modify(data) {
    data.divice_groups = generateGroups(data.divice_groups);
    data.group_list_to_pass = generatePersonGroups(data.group_list_to_pass);

    const { uuid, ...others } = data;
    await global.domain.crud.modify({
      collection: 'tablets',
      uuid,
      data: others,
      uniqueKeys: ['name', 'identity', 'ip_address', 'code'],
    });
  }

  function generateGroups(uuids) {
    const defaultUUid = '1';
    if (!uuids.includes(defaultUUid)) uuids.push(defaultUUid);

    const result = global.spiderman.db.videodevicegroups
      .find({ uuid: { $in: uuids } })
      .map(({ uuid }) => uuid);

    return result;
  }
  function generatePersonGroups(uuids) {
    const result = global.spiderman.db.groups
      .find({ uuid: { $in: uuids } })
      .map(({ uuid }) => uuid);

    return result;
  }

  return {
    create,
    modify,
  };
};
