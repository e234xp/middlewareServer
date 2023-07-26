module.exports = () => {
  const { db } = global.spiderman;
  async function find({
    uuid,
    slice_shift: sliceShift, slice_length: sliceLength,
  }) {
    const { totalLength, result } = await global.domain.crud
      .find({
        collection: 'videodevicegroups',
        query: { ...(uuid === '' ? {} : { uuid }) },
        sliceShift,
        sliceLength,
      });

    const resultWithDevices = result.map(({ uuid: theUuid, ...others }) => {
      const cameraUuidList = db.cameras
        .find({ divice_groups: { $some: [theUuid] } })
        .map((item) => item.uuid);
      // todo tablets

      return {
        uuid: theUuid,
        camera_uuid_list: cameraUuidList,
        ...others,
      };
    });

    return { totalLength, result: resultWithDevices };
  }

  async function create({
    name,
    camera_uuid_list: cameraUuidList, tablet_uuid_list: tabletUuidList,
  }) {
    const doesExist = !!db.videodevicegroups.findOne({ name });

    if (doesExist) throw Error('The item has already existed.');

    const { uuid } = await global.domain.crud.insertOne({
      collection: 'videodevicegroups',
      data: { name },
    });

    addGroupToDevices({
      uuid,
      cameraUuidList,
      tabletUuidList,
    });
  }

  async function modify({
    uuid,
    name,
    camera_uuid_list: cameraUuidList, tablet_uuid_list: tabletUuidList,
  }) {
    const fixedUuids = ['0', '1'];
    if (fixedUuids.includes(uuid)) throw Error('The item can not be change.');

    const doesExist = !!db.videodevicegroups.findOne({ name, uuid: { $ne: uuid } });
    if (doesExist) throw Error('The name has already existed.');

    await global.domain.crud.modify({
      collection: 'videodevicegroups',
      uuid,
      data: { name },
    });

    removeGroupsFromDevices([uuid]);
    addGroupToDevices({
      uuid,
      cameraUuidList,
      tabletUuidList,
    });
  }

  async function remove({ uuid }) {
    const fixedUuids = ['0', '1'];
    uuid = uuid.filter((item) => !fixedUuids.includes(item));

    db.videodevicegroups.deleteMany({ uuid: { $in: uuid } });
    removeGroupsFromDevices(uuid);
  }

  function addGroupToDevices({
    uuid: groupUuid,
    cameraUuidList, tabletUuidList,
  }) {
    cameraUuidList.forEach((deviceUuid) => {
      const camera = db.cameras.findOne({ uuid: deviceUuid });
      if (!camera) return;
      db.cameras.updateOne({ uuid: deviceUuid }, {
        divice_groups: [...camera.divice_groups, groupUuid],
      });
    });

    // todo tabletUuidList
  }

  function removeGroupsFromDevices(deleteUuids) {
    const cameras = db.cameras.find();

    const newCameras = cameras.map((camera) => {
      const newGroups = camera.divice_groups.filter(
        (uuid) => !uuid.includes(deleteUuids),
      );

      return {
        ...camera,
        divice_groups: newGroups,
      };
    });

    db.cameras.set(newCameras);

    // todo tabletUuidList
  }

  return {
    find,
    create,
    modify,
    remove,
  };
};
