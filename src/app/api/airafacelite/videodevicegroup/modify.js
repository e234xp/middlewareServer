const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'data',
    fieldType: 'object',
    required: true,
  },
];

const fieldChecksData = [
  {
    fieldName: 'name',
    fieldType: 'string',
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

module.exports = async (rData) => {
  const { uuid } = global.spiderman.validate.data({
    data: rData,
    fieldChecks,
  });

  const data = global.spiderman.validate.data({
    data: rData.data,
    fieldChecks: fieldChecksData,
  });
  
  if (!data.camera_uuid_list) data.camera_uuid_list = [];
  if (!data.tablet_uuid_list) data.tablet_uuid_list = [];

  await global.domain.videodevicegroup.modify({ uuid, ...data });

  return {
    message: 'ok',
  };
};
