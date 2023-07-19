const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'data',
    fieldType: 'object',
    required: true,
  },
];

const fieldChecksData = [
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'divice_groups',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'stream_type',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'connection_info',
    fieldType: 'nonempty',
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
  {
    fieldName: 'target_score',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'capture_interval',
    fieldType: 'number',
    required: true,
  },
];

const rtspFieldChecks = [
  {
    fieldName: 'ip_address',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'port',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'user',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'pass',
    fieldType: 'nonempty',
    required: true,
  },
];

module.exports = async (rData) => {
  const { uuid } = global.spiderman.validate.data({
    data: rData,
    fieldChecks,
  });

  const { stream_type: streamType } = rData.data;
  let data;
  if (streamType === 'rtsp') {
    data = global.spiderman.validate.data({
      data: rData.data,
      fieldChecks: [...fieldChecksData, ...rtspFieldChecks],
    });
  } else if (streamType === 'sdp') {
    data = {
      ...global.spiderman.validate.data({
        data: rData.data,
        fieldChecks: fieldChecksData,
      }),
      ...{
        ip_address: '',
        port: 0,
        user: '',
        pass: '',
      },
    };
  } else {
    throw Error('stream_type error.');
  }

  const MAX_ROI = 5;
  const { roi } = data;
  if (roi.length > MAX_ROI) throw Error(`Roi number has exceeded ${MAX_ROI} (max).`);

  const repeatDevice = global.domain.device.findByName(data.name);
  if (repeatDevice && repeatDevice.uuid !== uuid) throw Error(`Name existed. type: ${repeatDevice.type}`);

  await global.domain.crud.modify({
    collection: 'cameras', uuid, data,
  });

  return {
    message: 'ok',
  };
};
