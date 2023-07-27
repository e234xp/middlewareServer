module.exports = () => {
  const { db } = global.spiderman;
  async function find({
    uuid,
    slice_shift: sliceShift, slice_length: sliceLength,
  }) {
    const { totalLength, result } = await global.domain.crud
      .find({
        collection: 'outputdevicegroups',
        query: { ...(uuid === '' ? {} : { uuid }) },
        sliceShift,
        sliceLength,
      });

    const resultWithDevices = result.map(({ uuid: theUuid, ...others }) => {
      const wiegandConverterUuidList = db.wiegandconverters
        .find({ divice_groups: { $some: [theUuid] } })
        .map((item) => item.uuid);

      const ioboxUuidList = db.ioboxes
        .find({ divice_groups: { $some: [theUuid] } })
        .map((item) => item.uuid);

      return {
        uuid: theUuid,
        wiegand_converter_uuid_list: wiegandConverterUuidList,
        iobox_uuid_list: ioboxUuidList,
        ...others,
      };
    });

    return { totalLength, result: resultWithDevices };
  }

  async function create({
    name,
    wiegand_converter_uuid_list: wiegandConverterUuidList, iobox_uuid_list: ioBoxUuidList,
  }) {
    const doesExist = !!db.outputdevicegroups.findOne({ name });

    if (doesExist) throw Error('The item has already existed.');

    const { uuid } = await global.domain.crud.insertOne({
      collection: 'outputdevicegroups',
      data: { name },
    });

    addGroupToDevices({
      uuid,
      wiegandConverterUuidList,
      ioBoxUuidList,
    });
  }

  async function modify({
    uuid,
    name,
    wiegand_converter_uuid_list: wiegandConverterUuidList, iobox_uuid_list: ioBoxUuidList,
  }) {
    const fixedUuids = ['0', '1'];
    if (fixedUuids.includes(uuid)) throw Error('The item can not be change.');

    const doesExist = !!db.outputdevicegroups.findOne({ name, uuid: { $ne: uuid } });
    if (doesExist) throw Error('The name has already existed.');

    await global.domain.crud.modify({
      collection: 'outputdevicegroups',
      uuid,
      data: { name },
    });

    removeGroupsFromDevices([uuid]);
    addGroupToDevices({
      uuid,
      wiegandConverterUuidList,
      ioBoxUuidList,
    });
  }

  async function remove({ uuid }) {
    const fixedUuids = ['0', '1'];
    uuid = uuid.filter((item) => !fixedUuids.includes(item));

    db.outputdevicegroups.deleteMany({ uuid: { $in: uuid } });
    removeGroupsFromDevices(uuid);
  }

  function addGroupToDevices({
    uuid: groupUuid,
    wiegandConverterUuidList, ioBoxUuidList,
  }) {
    wiegandConverterUuidList.forEach((deviceUuid) => {
      const wiegandConverter = db.wiegandconverters.findOne({ uuid: deviceUuid });
      if (!wiegandConverter) return;
      db.wiegandconverters.updateOne({ uuid: deviceUuid }, {
        divice_groups: [...wiegandConverter.divice_groups, groupUuid],
      });
    });

    ioBoxUuidList.forEach((deviceUuid) => {
      const iobox = db.ioboxes.findOne({ uuid: deviceUuid });
      if (!iobox) return;
      db.ioboxes.updateOne({ uuid: deviceUuid }, {
        divice_groups: [...iobox.divice_groups, groupUuid],
      });
    });
  }

  function removeGroupsFromDevices(deleteUuids) {
    const wiegandconverters = db.wiegandconverters.find();

    const newWiegandconverters = wiegandconverters.map((wiegandconverter) => {
      const newGroups = wiegandconverter.divice_groups.filter(
        (uuid) => !uuid.includes(deleteUuids),
      );

      return {
        ...wiegandconverter,
        divice_groups: newGroups,
      };
    });

    db.wiegandconverters.set(newWiegandconverters);

    const ioboxes = db.ioboxes.find();

    const newioboxes = ioboxes.map((iobox) => {
      const newGroups = iobox.divice_groups.filter(
        (uuid) => !uuid.includes(deleteUuids),
      );

      return {
        ...iobox,
        divice_groups: newGroups,
      };
    });

    db.ioboxes.set(newioboxes);
  }

  return {
    find,
    create,
    modify,
    remove,
  };
};
