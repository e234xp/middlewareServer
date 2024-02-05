const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'access_token',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'language',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'fields',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'note',
    fieldType: 'string',
    required: true,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const { uuid, ...others } = data;
  global.domain.crud.modify({
    collection: 'linecommands',
    uuid,
    data: others,
    uniqueKeys: ['name'],
  });

  return {
    message: 'ok',
  };
};
