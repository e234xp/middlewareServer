const { promisify } = require('util');
const fs = require('fs');

module.exports = async (data) => {
  const { file } = data;
  if (!file) throw Error('Invalid parameter.');

  const fileMove = promisify(file.mv);
  const targetZipFile = `${global.params.importPath}/${file.name}`;

  await fileMove(targetZipFile);

  const response = await global.spiderman.request.make({
    url: `http://${global.params.localhost}/system/unzipdb`,
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
