const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'brand',
    fieldType: 'nonempty',
    required: false,
  },
  {
    fieldName: 'model',
    fieldType: 'nonempty',
    required: false,
  },
  {
    fieldName: 'divice_groups',
    fieldType: 'array',
    required: false,
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
    required: false,
  },
  {
    fieldName: 'password',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'iopoint',
    fieldType: 'array',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  try {
    await global.domain.iobox.create(data);
  } catch (ex) {
    throw Error(ex.message);
  }

  global.domain.workerIobox.init();

  return {
    message: 'ok',
  };
};
