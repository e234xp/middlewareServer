const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'condition',
    fieldType: 'object',
    required: true,
  },
  {
    fieldName: 'actions',
    fieldType: 'object',
    required: true,
  },
];

const conditionFieldChecks = [
  {
    fieldName: 'access_type',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'video_device_groups',
    fieldType: 'nonempty-array',
    required: true,
  },
  {
    fieldName: 'groups',
    fieldType: 'nonempty-array',
    required: true,
  },
  {
    fieldName: 'schedule',
    fieldType: 'string',
    required: true,
  },
];

const actionFieldChecks = [
  {
    fieldName: 'ioboxes',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'wiegand_converters',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'line_commands',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'email_commands',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'http_commands',
    fieldType: 'array',
    required: true,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  global.spiderman.validate.data({
    data: data.condition,
    fieldChecks: conditionFieldChecks,
  });

  global.spiderman.validate.data({
    data: data.actions,
    fieldChecks: actionFieldChecks,
  });

  global.domain.rule.create(data);

  return {
    message: 'ok',
  };
};
