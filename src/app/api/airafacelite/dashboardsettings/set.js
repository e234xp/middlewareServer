module.exports = (data) => {
  const settings = global.spiderman.db.dashboardsettings.findOne({});

  data = { ...settings, ...data };

  global.spiderman.db.dashboardsettings.updateOne({}, data);

  return {
    message: 'ok',
  };
};
