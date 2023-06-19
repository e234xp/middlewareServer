module.exports = (data) => {
  global.spiderman.db.eventsettings.updateOne({}, data);

  return {
    message: 'ok',
  };
};
