module.exports = () => {
  const { db } = global.spiderman;
  async function find({ uuid }) {
    const videoGroups = uuid
      ? [await db.videogroups.findOne({ uuid })]
      : await db.videogroups.find();

    return videoGroups;
  }

  async function create({ name, ...others }) {
    const doesExist = !!db.videogroups.findOne({ name });

    if (doesExist) throw Error('The item has already existed.');

    await global.domain.crud.insertOne({
      collection: 'videogroups',
      data: { name, ...others },
    });

    addGroupToVideos({
      name,
      ...others,
    });
  }

  async function modify({
    uuid,
    camera_uuid_list: cameraUuidList, tablet_uuid_list: tabletUuidList,
  }) {
    const { name } = await db.videogroups.findOne({ uuid });

    await global.domain.crud.modify({
      collection: 'videogroups',
      uuid,
      data: { camera_uuid_list: cameraUuidList, tablet_uuid_list: tabletUuidList },
    });

    removeGroupsFromVideos([name]);
    addGroupToVideos({
      name,
      camera_uuid_list: cameraUuidList,
      tablet_uuid_list: tabletUuidList,
    });
  }

  async function remove({ uuid }) {
    const videoGroups = await db.videogroups.find({ uuid: { $in: uuid } });

    db.videogroups.deleteMany({ uuid: { $in: uuid } });

    const names = videoGroups.map(({ name }) => name);

    removeGroupsFromVideos([names]);
  }

  function addGroupToVideos({
    name,
    camera_uuid_list: cameraUuidList, tablet_uuid_list: tabletUuidList,
  }) {
    cameraUuidList.forEach((uuid) => {
      const camera = db.cameras.findOne({ uuid });
      if (!camera) return;
      db.cameras.updateOne({ uuid }, {
        divice_groups: [...camera.divice_groups, name],
      });
      console.log([...camera.divice_groups, name]);
    });

    // todo tabletUuidList
  }

  function removeGroupsFromVideos(names) {
    const cameras = db.cameras.find();

    const newCameras = cameras.map((camera) => {
      const newGroups = camera.divice_groups.filter((groupName) => !groupName.includes(names));

      return {
        ...camera,
        divice_groups: newGroups,
      };
    });

    db.cameras.set(newCameras);
  }

  return {
    find,
    create,
    modify,
    remove,
  };
};
