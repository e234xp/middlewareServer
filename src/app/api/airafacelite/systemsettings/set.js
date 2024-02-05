module.exports = (data) => {
  const settings = global.spiderman.db.system_settings.find();

  data = { ...settings, ...data };

  global.spiderman.db.system_settings.updateOne({}, data);

  return {
    message: 'ok',
  };
};
