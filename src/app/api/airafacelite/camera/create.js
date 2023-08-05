const fieldChecks = [
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
    fieldType: 'port',
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

module.exports = async (data) => {
  const { stream_type: streamType } = data;
  if (streamType === 'rtsp') {
    data = global.spiderman.validate.data({
      data,
      fieldChecks: [...fieldChecks, ...rtspFieldChecks],
    });
  } else if (streamType === 'sdp') {
    data = {
      ...global.spiderman.validate.data({
        data,
        fieldChecks,
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

  await global.domain.camera.create(data);

  return {
    message: 'ok',
  };
};
