module.exports = async () => {
  const path = `${global.spiderman.param.fileroot}${global.spiderman.param.dataPath}/dbbak.dbf`;
  const fileName = (() => {
    const now = new Date();

    return `airafacelitedb-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.dbf`;
  })();

  return {
    action: 'download',
    path,
    fileName,
  };
};
