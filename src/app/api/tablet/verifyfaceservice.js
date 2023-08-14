const fieldChecks = [
  {
    fieldName: 'client_id',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'device_uuid',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'verify_mode',
    fieldType: 'number',
    required: false,
  },
  {
    fieldName: 'face_image',
    fieldType: 'nonempty',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const sourceId = await global.domain.tabletverify.verifyFace(data);

  return {
    message: 'ok',
    verify_face_id: sourceId,
  };
};
