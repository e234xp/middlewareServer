module.exports = () => {
  const settings = global.spiderman.db.settings.findOne({});

  return {
    message: 'ok',
    settings,
  };
};
