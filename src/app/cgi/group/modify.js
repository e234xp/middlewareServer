const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'remarks',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'person_uuid_list',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'visitor_uuid_list',
    fieldType: 'array',
    required: true,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  if (data.uuid.length === 0) throw Error('Name cannot be empty.');

  global.domain.group.modifyAndModifyPersonGroup(data);

  return {
    message: 'ok',
  };
};
