module.exports = (data) => {
  global.spiderman.db.dashboardsettings.updateOne({}, data);

  return {
    message: 'ok',
  };
};
