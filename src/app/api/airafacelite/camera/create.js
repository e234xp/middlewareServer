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

module.exports = async (data) => {
  global.spiderman.systemlog.generateLog(4, `camera create name=[${data.name}]`);

  const cameras = global.domain.camera.count();
  const tablets = global.domain.tablet.count();

  try {
    const response = await global.spiderman.request.make({
      url: `http://${global.params.localhost}/system/findlicense`,
      method: 'POST',
      pool: { maxSockets: 10 },
      time: true,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      json: data,
    });

    let licAmount = 0;
    if (response) {
      const formalLic = response.license.filter((l) => l.permanent === true);

      if (formalLic.length >= 1) {
        for (let j = 0; j < formalLic.length; j += 1) {
          licAmount += (formalLic[j].channel_amount || 0);
        }
      } else {
        const trialLic = response.license.filter(
          (l) => l.permanent === false && l.trial_end_time >= new Date().toISOString(),
        );

        if (trialLic.length >= 1) {
          if (trialLic.length >= 2) {
            trialLic.sort((a, b) => b.activation_date - a.activation_date);
          }

          licAmount = trialLic[0].channel_amount;
        }
      }
    } else {
      global.spiderman.systemlog.generateLog(2, 'license not found.');
      throw Error('license not found.');
    }

    if ((cameras + tablets) >= licAmount) {
      global.spiderman.systemlog.generateLog(2, `limit of airaFace amount [ ${licAmount} ].`);
      throw Error(`limit of airaFace amount [ ${licAmount} ].`);
    }
  } catch (e) {
    global.spiderman.systemlog.generateLog(2, `fatch license error. ${e}`);
    throw Error(`fatch license error. ${e}`);
  }

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
    global.spiderman.systemlog.generateLog(2, 'stream_type error.');
    throw Error('stream_type error.');
  }

  await global.domain.camera.create(data);
  global.spiderman.systemlog.generateLog(2, `camera create uuid=${data.uuid} name=${data.name}`);

  return {
    message: 'ok',
    uuid: data.uuid,
    name: data.name,
  };
};
