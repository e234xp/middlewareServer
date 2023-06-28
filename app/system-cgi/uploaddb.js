const { promisify } = require('util');
const fs = require('fs');

module.exports = async (data) => {
  const { file } = data;
  if (!file) throw Error('no file');

  const fileMove = promisify(file.mv);
  const targetZipFile = `${global.spiderman.param.fileroot}${global.spiderman.param.importPath}/${file.name}`;

  await fileMove(targetZipFile);

  const response = await global.spiderman.request.make({
    url: `http://${global.spiderman.param.localhost}/system/unzipdb`,
    method: 'POST',
    pool: { maxSockets: 10 },
    time: true,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
    json: { filename: targetZipFile },
  });

  fs.unlinkSync(targetZipFile);

  return response;
};
