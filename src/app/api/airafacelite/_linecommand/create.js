const fieldChecks = [
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

  global.domain.crud.insertOne({
    collection: 'linecommands',
    data,
    uniqueKeys: ['name'],
  });

  return {
    message: 'ok',
  };
};
