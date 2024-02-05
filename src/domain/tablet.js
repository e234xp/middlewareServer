module.exports = () => {
  async function create(data) {
    // todo 確認 MAX 數量
    const MAX_AMOUNT = 500;
    const tablets = global.spiderman.db.tablets.find();
    if (tablets.length >= MAX_AMOUNT) throw Error(`Items in database has exceeded ${MAX_AMOUNT} (max).`);

    const repeatItem = global.domain.device.findByName(data.name);
    if (repeatItem) throw Error(`Name existed. type: ${repeatItem.type}`);

    data.divice_groups = generateGroups(data.divice_groups);
    data.group_list_to_pass = generatePersonGroups(data.group_list_to_pass);

    await global.domain.crud.insertOne({
      collection: 'tablets',
      data,
    });
  }

  async function modify({ uuid, data }) {
    const repeatItem = global.domain.device.findByName(data.name);
    if (repeatItem && repeatItem.uuid !== uuid) throw Error(`Name existed. type: ${repeatItem.type}`);

    data.divice_groups = generateGroups(data.divice_groups);
    data.group_list_to_pass = generatePersonGroups(data.group_list_to_pass);

    await global.domain.crud.modify({
      collection: 'tablets',
      uuid, 
      data,
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

  async function status() {
    return new Promise((resolve) => {
      resolve([...global.runtimcache.camerasStatus, ...global.runtimcache.tabletsStatus]);
    });
  }

  async function change(data) {
    const { uuid } = data;
    await global.domain.crud.modify({
      collection: 'tablets',
      uuid,
      data: { ip_address: '', code: '' },
    });
  }

  return {
    create,
    modify,
    status,
    change,
  };
};
