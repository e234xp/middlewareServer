module.exports = async () => {
  await global.domain.videogroup.initDb();

  return 'success';
};
