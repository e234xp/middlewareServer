const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'string',
    required: false,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const groupList = global.domain.group.findWithPerson(data);

  return {
    message: 'ok',
    group_list: groupList,
  };
};
