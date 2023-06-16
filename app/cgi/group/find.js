module.exports = (data) => {
  console.log('hey');

  const groups = global.spiderman.db.groups.find();

  return {
    message: 'ok',
    group_list: groups,
  };
};
