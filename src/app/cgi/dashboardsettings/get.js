module.exports = () => {
  const settings = global.spiderman.db.dashboardsettings.findOne({});

  return {
    message: 'ok',
    settings,
  };
};
