module.exports = async () => {
  const { db } = global.spiderman;
  // todo 實作全部的 reset
  db.videogroups.reset();

  return 'success';
};
