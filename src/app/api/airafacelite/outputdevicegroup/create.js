const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'wiegand_converter_uuid_list',
    fieldType: 'array',
    required: false,
  },
  {
    fieldName: 'iobox_uuid_list',
    fieldType: 'array',
    required: false,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  if (!data.wiegand_converter_uuid_list) data.wiegand_converter_uuid_list = [];
  if (!data.iobox_uuid_list) data.iobox_uuid_list = [];

  await global.domain.outputdevicegroup.create(data);

  return {
    message: 'ok',
  };
};
