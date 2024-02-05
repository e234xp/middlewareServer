const fieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'remarks',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'person_uuid_list',
    fieldType: 'array',
    required: false,
  },
  {
    fieldName: 'visitor_uuid_list',
    fieldType: 'array',
    required: false,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  // optional paramters set default value
  if (!data.remarks) data.remarks = '';
  if (!data.person_uuid_list) data.person_uuid_list = [];
  if (!data.visitor_uuid_list) data.visitor_uuid_list = [];

  if (data.name.length === 0) throw Error('Name cannot be empty.');

  global.domain.group.createAndModifyPersonGroup(data);

  return {
    message: 'ok',
  };
};
