const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'brand',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'model',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'divice_groups',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'ip_address',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'port',
    fieldType: 'port',
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
    fieldName: 'iopoint',
    fieldType: 'array',
    required: true,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  global.domain.iobox.create(data);
  global.domain.workerIobox.init();

  return {
    message: 'ok',
  };
};
