const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'nonempty',
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
  {
    fieldName: 'verified_merge_setting',
    fieldType: 'object',
    required: true,
  },
  {
    fieldName: 'non_verified_merge_setting',
    fieldType: 'object',
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
      ...{
        verified_merge_setting: {
          enable: true,
          merge_duration: 0,
          non_action: true,
        },
      },
      ...{
        non_verified_merge_setting: {
          enable: false,
          merge_score: 0.8,
          merge_duration: 0,
          non_action: true,
        },
      },
    };
  } else {
    throw Error('stream_type error.');
  }

  await global.domain.camera.modify({ uuid, data });

  return {
    message: 'ok',
  };
};
