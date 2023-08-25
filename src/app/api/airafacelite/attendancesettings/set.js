module.exports = (data) => {
  const setting = global.spiderman.db.attendancesettings.findOne({});
  if (!setting) {
    global.spiderman.db.attendancesettings.insertOne(data);
    return {
      message: 'ok',
    };
  }

  global.spiderman.db.attendancesettings.updateOne({}, data);
  return {
    message: 'ok',
  };
};
