module.exports = (data) => {
  global.spiderman.db.settings.updateOne({}, data);

  return {
    message: 'ok',
  };
};
