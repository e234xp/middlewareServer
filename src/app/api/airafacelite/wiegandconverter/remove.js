const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'array',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  await global.domain.crud.remove({ collection: 'wiegandconverters', uuid: data.uuid });

  return {
    message: 'ok',
  };
};
