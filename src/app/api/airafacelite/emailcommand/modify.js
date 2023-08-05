const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'host',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'port',
    fieldType: 'port',
    required: true,
  },
  {
    fieldName: 'security',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'email',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'password',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'sender',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'subject',
    fieldType: 'nonempty',
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
    fieldName: 'fields',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'note',
    fieldType: 'string',
    required: true,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  global.domain.emailcommand.modify(data);

  return {
    message: 'ok',
  };
};
