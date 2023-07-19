const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'divice_groups',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'ip_address',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'port',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'bits',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'index',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'syscode',
    fieldType: 'number',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  // todo 確認 MAX 數量
  const MAX_AMOUNT = 500;
  const wiegandConverters = global.spiderman.db.wiegandconverters.find();
  if (wiegandConverters.length >= MAX_AMOUNT) throw Error(`Items in database has exceeded ${MAX_AMOUNT} (max).`);

  const repeatDevice = global.domain.device.findByName(data.name);
  if (repeatDevice) throw Error(`Name existed. type: ${repeatDevice.type}`);

  await global.domain.crud.insertOne({ collection: 'wiegandconverters', data });

  return {
    message: 'ok',
  };
};
