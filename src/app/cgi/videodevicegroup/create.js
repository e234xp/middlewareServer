const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'camera_uuid_list',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'tablet_uuid_list',
    fieldType: 'array',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  await global.domain.videodevicegroup.create(data);

  return {
    message: 'ok',
  };
};
