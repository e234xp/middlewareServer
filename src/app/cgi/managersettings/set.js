module.exports = (data) => {
  global.spiderman.db.managersettings.updateOne({}, data);

  return {
    message: 'ok',
  };
};
