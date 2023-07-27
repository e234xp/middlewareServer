module.exports = async () => {
  const { initdb } = global.domain;
  initdb.init();

  return 'success';
};
