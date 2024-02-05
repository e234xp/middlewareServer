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
    fieldName: 'action_type',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'enable',
    fieldType: 'boolean',
    required: true,
  },
  {
    fieldName: 'group_list',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'temperature_trigger_rule',
    fieldType: 'number',
    required: false,
  },
  {
    fieldName: 'remarks',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'specify_time',
    fieldType: 'object',
    required: false,
  },
  {
    fieldName: 'weekly_schedule',
    fieldType: 'object',
    required: false,
  },
];

const lineFieldChecks = [
  {
    fieldName: 'token',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'data_list',
    fieldType: 'object',
    required: true,
  },
];

const httpFieldChecks = [
  {
    fieldName: 'https',
    fieldType: 'boolean',
    required: true,
  },
  {
    fieldName: 'method',
    fieldType: 'string',
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
  {
    fieldName: 'host',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'port',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'data_type',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'url',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'custom_data',
    fieldType: 'string',
    required: false,
  },
];

const mailFieldChecks = [
  {
    fieldName: 'method',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'secure',
    fieldType: 'boolean',
    required: true,
  },
  {
    fieldName: 'from',
    fieldType: 'string',
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
  {
    fieldName: 'host',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'port',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'subject',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'to',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'cc',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'bcc',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'data_list',
    fieldType: 'object',
    required: true,
  },
];

module.exports = async (rData) => {
  const { uuid } = global.spiderman.validate.data({
    data: rData,
    fieldChecks,
  });

  const { action_type: actionType } = rData.data;
  let data;
  if (actionType === 'line') {
    data = global.spiderman.validate.data({
      data: rData.data,
      fieldChecks: [...fieldChecksData, ...lineFieldChecks],
    });
  } else if (actionType === 'http') {
    data = global.spiderman.validate.data({
      data: rData.data,
      fieldChecks: [...fieldChecksData, ...httpFieldChecks],
    });
  } else if (actionType === 'mail') {
    data = global.spiderman.validate.data({
      data: rData.data,
      fieldChecks: [...fieldChecksData, ...mailFieldChecks],
    });
  } else {
    throw Error('action_type error.');
  }

  console.log('aaa', { uuid, data });

  await global.domain.eventhandle.modify({ uuid, data });

  return {
    message: 'ok',
  };
};
