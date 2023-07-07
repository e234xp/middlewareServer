process.env.UV_THREADPOOL_SIZE = 128;

const express = require('express');
const http = require('http');
const https = require('https');

const argObject = (() => {
  const result = {};

  process.argv.forEach((a, index) => {
    const isValid = index > 1;
    if (!isValid) return;

    const [key, value] = a.split('=');

    result[key] = value;
  });

  return result;
})();

global.params = generatePatams(argObject);
function generatePatams({
  fileroot = '/home/gavin/userdata/aira',
  localhost = '127.0.0.1:8588',
}) {
  const dataPath = `${fileroot}/data`;
  const swPath = `${fileroot}/sw`;
  const fwPath = `${fileroot}/fw`;
  const importPath = `${fileroot}/import`;

  return {
    fileroot,
    localhost,
    dataPath,
    swPath,
    fwPath,
    importPath,
    cgiCounter: 0,
    maxCgiNumber: 50,
  };
}

const spiderman = require('./spiderman/index');
const domain = require('./domain/index');

global.spiderman = spiderman.init();
global.domain = domain.init();

process.on('uncaughtException', (err) => {
  console.log('system UCE : ', err);
});

const expressApp = express()
  .use(express.json({ limit: '50mb' }))
  .use(express.text({ limit: '50mb' }))
  .use(global.spiderman.express.useLimitCgiNumber({ routesNeedToLimit: ['airafacelite', 'system'] }))
  .use(global.spiderman.express.useCors())
  .use(global.spiderman.express.useFileUpload())
  .use('/airafacelite', require('./interface')('/airafacelite'))
  .use('/system', require('./interface')('/system'))
  .use(express.static(`${global.params.swPath}/wwwdist`));

global.spiderman.server = (() => {
  const httpServer = global.spiderman.express.createAndListenServer(http, 80, expressApp);
  const httpsServer = global.spiderman.express.createAndListenServer(https, 443, expressApp);
  const wss = global.spiderman.socket.create({ server: httpServer, path: '/airafacelite/verifyresults' });
  const wssWithSsl = global.spiderman.socket.create({ server: httpsServer, path: '/airafacelite/verifyresults' });

  return {
    http: httpServer,
    https: httpsServer,
    wss,
    wssWithSsl,
  };
}
)();
