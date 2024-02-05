const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'camera_uuid_list',
    fieldType: 'array',
    required: false,
  },
  {
    fieldName: 'tablet_uuid_list',
    fieldType: 'array',
    required: false,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  if (!data.camera_uuid_list) data.camera_uuid_list = [];
  if (!data.tablet_uuid_list) data.tablet_uuid_list = [];

  await global.domain.videodevicegroup.create(data);

  return {
    message: 'ok',
  };
};
