const fieldChecks = [
  {
    fieldName: 'name',
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

  if (data.name.length === 0) throw Error('name cannot be empty.');

  global.domain.group.createAndModifyPersonGroup(data);

  return {
    message: 'ok',
  };
};
