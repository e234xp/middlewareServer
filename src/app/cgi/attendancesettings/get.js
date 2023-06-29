module.exports = () => {
  const settings = global.spiderman.db.attendancesettings.findOne({});

  return {
    message: 'ok',
    settings,
  };
};
