const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'ip_address',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'code',
    fieldType: 'string',
    required: false,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  global.domain.tablet.change(data);

  return {
    message: 'ok',
  };
};
