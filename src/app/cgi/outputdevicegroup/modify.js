const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'name',
    fieldType: 'string',
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

  await global.domain.outputdevicegroup.modify(data);

  return {
    message: 'ok',
  };
};
