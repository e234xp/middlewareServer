module.exports = async () => {
  const { initdb } = global.domain;
  // todo 實作全部的 reset
  initdb.init();

  return 'success';
};
