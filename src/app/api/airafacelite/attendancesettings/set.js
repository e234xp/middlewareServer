module.exports = (data) => {
  global.spiderman.db.attendancesettings.updateOne({}, data);

  return {
    message: 'ok',
  };
};
