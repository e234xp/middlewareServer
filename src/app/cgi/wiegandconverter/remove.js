const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'array',
    required: true,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  global.domain.crud.remove({ collection: 'wiegandconverters', uuid: data.uuid });

  return {
    message: 'ok',
  };
};
