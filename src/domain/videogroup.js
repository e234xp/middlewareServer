module.exports = () => {
  const { db } = global.spiderman;
  async function find({
    uuid,
    slice_shift: sliceShift, slice_length: sliceLength,
  }) {
    const { totalLength, result } = await global.domain.crud
      .find({
        collection: 'videogroups',
        query: { ...(uuid === '' ? {} : { uuid }) },
        sliceShift,
        sliceLength,
      });

    const resultWithVideoDevices = result.map(({ uuid: theUuid, ...others }) => {
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

    return { totalLength, result: resultWithVideoDevices };
  }

  async function create({
    name,
    camera_uuid_list: cameraUuidList, tablet_uuid_list: tabletUuidList,
  }) {
    const doesExist = !!db.videogroups.findOne({ name });

    if (doesExist) throw Error('The item has already existed.');

    const { uuid } = await global.domain.crud.insertOne({
      collection: 'videogroups',
      data: { name },
    });

    addGroupToVideoDevices({
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

    const doesExist = !!db.videogroups.findOne({ name, uuid: { $ne: uuid } });
    if (doesExist) throw Error('The name has already existed.');

    await global.domain.crud.modify({
      collection: 'videogroups',
      uuid,
      data: { name },
    });

    removeGroupsFromVideoDevices([uuid]);
    addGroupToVideoDevices({
      uuid,
      cameraUuidList,
      tabletUuidList,
    });
  }

  async function remove({ uuid }) {
    const fixedUuids = ['0', '1'];
    uuid = uuid.filter((item) => !fixedUuids.includes(item));

    db.videogroups.deleteMany({ uuid: { $in: uuid } });
    removeGroupsFromVideoDevices(uuid);
  }

  function addGroupToVideoDevices({
    uuid: groupUuid,
    cameraUuidList, tabletUuidList,
  }) {
    cameraUuidList.forEach((cameraUuid) => {
      const camera = db.cameras.findOne({ uuid: cameraUuid });
      if (!camera) return;
      db.cameras.updateOne({ uuid: cameraUuid }, {
        divice_groups: [...camera.divice_groups, groupUuid],
      });
    });

    // todo tabletUuidList
  }

  function removeGroupsFromVideoDevices(deleteUuids) {
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
