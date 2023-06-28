process.env.UV_THREADPOOL_SIZE = 128;

const express = require('express');
const http = require('http');
const https = require('https');

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
  .use('/airafacelite', require('./interface/cgi'))
  .use('/system', require('./interface/system-cgi'))
  .use(express.static(`${global.spiderman.param.fileroot}${global.spiderman.param.swPath}/wwwdist`));

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
