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

  global.domain.wiegandconverter.remove(data);
  global.domain.workerWiegand.init();

  return {
    message: 'ok',
  };
};
