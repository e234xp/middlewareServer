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
    fieldName: 'stream_type',
    fieldType: 'string',
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
    fieldName: 'user',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'connection_info',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'capture_interval',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'target_score',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'roi',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'face_min_length',
    fieldType: 'number',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const MAX_ROI = 5;
  const { roi } = data;
  if (roi.length > MAX_ROI) throw Error(`Roi number has exceeded ${MAX_ROI} (max).`);

  // todo 確認 MAX 數量
  const MAX_AMOUNT = 500;
  const cameras = global.spiderman.db.cameras.find();
  if (cameras.length >= MAX_AMOUNT) throw Error(`Items in database has exceeded ${MAX_AMOUNT} (max).`);

  const repeatDevice = global.domain.device.findByName(data.name);
  if (repeatDevice) throw Error(`Name existed. type: ${repeatDevice.type}`);

  await global.domain.crud.insert({ collection: 'cameras', data });

  return {
    message: 'ok',
  };
};
