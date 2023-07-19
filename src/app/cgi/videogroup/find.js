const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'string',
    required: false,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const groupList = await global.domain.videogroup.find(data);

  return {
    message: 'ok',
    group_list: groupList,
  };
};
