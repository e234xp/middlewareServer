const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'wiegand_converter_uuid_list',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'iobox_uuid_list',
    fieldType: 'array',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  await global.domain.outputdevicegroup.create(data);

  return {
    message: 'ok',
  };
};
