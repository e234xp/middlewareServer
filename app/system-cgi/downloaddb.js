module.exports = async () => {
  const path = `${global.spiderman.param.fileroot}${global.spiderman.param.dataPath}/dbbak.dbf`;
  const now = new Date();
  const fileName = `airafacelitedb-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.dbf`;

  return {
    action: 'download',
    path,
    fileName,
  };
};
