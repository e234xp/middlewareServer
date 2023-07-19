module.exports = () => {
  async function initDb() {
    const data = [
      {
        uuid: '0',
        name: 'All Cameras',
        camera_uuid_list: [],
        tablet_uuid_list: [],
      },
      {
        uuid: '1',
        name: 'All Tablets',
        camera_uuid_list: [],
        tablet_uuid_list: [],
      },
    ];

    await global.domain.crud.insertMany({ collection: 'videogroup', data });
  }

  return {
    initDb,
  };
};
