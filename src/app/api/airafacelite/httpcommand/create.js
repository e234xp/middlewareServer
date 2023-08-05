const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'method',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'url',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'username',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'password',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'fields',
    fieldType: 'object',
    required: true,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  global.domain.crud.insertOne({
    collection: 'httpcommands',
    data,
    uniqueKeys: ['name'],
  });

  return {
    message: 'ok',
  };
};
