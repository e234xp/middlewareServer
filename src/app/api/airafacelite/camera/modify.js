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
    fieldName: 'antispoofing_score',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'face_detection_score',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'april_tag_type',
    fieldType: 'string',
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
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'pass',
    fieldType: 'string',
    required: false,
  },
];

module.exports = async (rData) => {
  global.spiderman.systemlog.generateLog(4, `camera modify uuid=[${rData.uuid}] name=[${rData.data.name}]`);

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
    global.spiderman.systemlog.generateLog(4, 'camera modify stream_type error.');
    throw Error('stream_type error.');
  }

  await global.domain.camera.modify({ uuid, data });

  global.spiderman.systemlog.generateLog(4, `camera modify uuid: ${data.uuid} name: ${data.name})}`);
  return {
    message: 'ok',
    uuid: data.uuid,
    name: data.name,
  };
};
