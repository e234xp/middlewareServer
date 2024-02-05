const fieldChecks = [
  {
    fieldName: 'records',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'commands',
    fieldType: 'string',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  global.domain.verifyresult.addcommands(data);

  return {
    message: 'ok',
  };
};
