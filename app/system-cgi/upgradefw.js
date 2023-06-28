const { promisify } = require('util');

module.exports = async (data) => {
  const { file } = data;
  if (!file) throw Error('no file');

  const fileMove = promisify(file.mv);
  const targetFile = `${global.spiderman.param.fwPath}/sw_upgrade_image.airasoft`;

  await fileMove(targetFile);

  await global.spiderman.request.make({
    url: `http://${global.spiderman.param.localhost}/system/upgradefw`,
    method: 'POST',
    pool: { maxSockets: 10 },
    time: true,
    timeout: 300000,
    headers: {
      'Content-Type': 'application/json',
    },
    json: {},
  });

  return { message: 'ok' };
};
