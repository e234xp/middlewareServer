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
    fieldName: 'card_number',
    fieldType: 'nonempty',
    required: false,
  },
  {
    fieldName: 'timestamp',
    fieldType: 'number',
    required: false,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const sourceId = global.domain.tabletverify.verifyCard(data);

  return {
    message: 'ok',
    verify_face_id: sourceId,
  };
};
