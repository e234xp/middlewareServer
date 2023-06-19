module.exports = () => {
  const settings = global.spiderman.db.eventsettings.findOne({});

  return {
    message: 'ok',
    settings,
  };
};
