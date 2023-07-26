const { uuid: uuidv4 } = require('uuidv4');

module.exports = [
  {
    uuid: uuidv4(),
    name: 'All Cameras',
    camera_uuid_list: [],
    tablet_uuid_list: [],
    created_time: Date.now(),
    updated_time: Date.now(),
  },
  {
    uuid: uuidv4(),
    name: 'All Tablets',
    camera_uuid_list: [],
    tablet_uuid_list: [],
    created_time: Date.now(),
    updated_time: Date.now(),
  },
];
