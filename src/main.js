process.env.UV_THREADPOOL_SIZE = 128;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 引入 .env
require('dotenv').config();

// const parse = require('url');

const express = require('express');
const http = require('http');
const https = require('https');

// function defineLog(logLevel, logString) {
//   // const scriptName = require('path').basename(__filename);
//   let scriptName = __filename.replace(global.params.swPath, '');
//   scriptName = scriptName.replace(global.params.devPath, '');

//   const { pid } = process;
//   const callerName = defineLog.caller.name;

//   global.spiderman.systemlog.writeLog({
//     logLevel, pid, scriptName, callerName, logString,
//   });
// }

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

global.params = generateParams(argObject);
function generateParams({
  fileroot = '/home/aira/product',
  httpport = 80,
  httpsport = 443,
  localhost = '127.0.0.1:8588',
  loglevel = 2,
  logreset = 0,
}) {
  if (process.env.NODE_ENV !== 'production') {
    localhost = '192.168.10.122:8588';
    loglevel = 5;
  } else {
    loglevel = 4;
  }

  // 1. 'FATAL',
  // 2. 'ERROR',
  // 3. 'WARN',
  // 4. 'INFO',
  // 5. 'DEBUG',
  // 6. 'TRACE'

  if ([1, 2, 3, 4, 5, 6].indexOf(loglevel) <= -1) {
    loglevel = 2;
  }

  const dataPath = `${fileroot}/data`;
  const swPath = `${fileroot}/sw`;
  const fwPath = `${fileroot}/fw`;
  const importPath = `${fileroot}/import`;
  const devPath = `${fileroot}/middlewareServer-main/src`;

  return {
    fileroot,
    localhost,
    dataPath,
    swPath,
    fwPath,
    devPath,
    importPath,
    httpport,
    httpsport,
    loglevel,
    logreset,
  };
}

const spiderman = require('./spiderman/index');
const domain = require('./domain/index');
const runtimcache = require('./runtimcache/index');

global.spiderman = spiderman.init();

global.spiderman.systemlog.generateLog(4, `
  fileroot=${global.params.fileroot},
  localhost=${global.params.localhost},
  dataPath=${global.params.dataPath},
  swPath=${global.params.swPath},
  httpport=${global.params.httpport},
  httpsport=${global.params.httpsport},
  loglevel=${global.params.loglevel}`);

process.on('uncaughtException', (err) => {
  global.spiderman.systemlog.generateLog(2, `
    err=[${err.message}]
    err=[${err}]`);

  console.log('system UCE : ', err);
});

const expressApp = express()
  .use(express.json({ limit: '50mb' }))
  .use(express.text({ limit: '50mb' }))
  .use(global.spiderman.express.useCors())
  .use(global.spiderman.express.useFileUpload())
  .use('/airafacelite', require('./interface/api')('/airafacelite'))
  .use('/airaface', require('./interface/api')('/tablet'))
  .use('/system', require('./interface/api')('/system'))
  .use(express.static(`${global.params.swPath}/wwwdist`));

global.spiderman.server = (() => {
  const httpServer = global.spiderman.express
    .createAndListenServer(http, global.params.httpport, expressApp, false);
  const httpsServer = global.spiderman.express
    .createAndListenServer(https, global.params.httpsport, expressApp, true);

  const wsVerifyresults = global.spiderman.socket.create(
    { server: null, path: '/airafacelite/verifyresults', noServer: true },
  );

  const wsRecognized = global.spiderman.socket.create(
    { server: null, path: '/fcsrecognizedresult', noServer: true },
  );

  const wsNonrecognized = global.spiderman.socket.create(
    { server: null, path: '/fcsnonrecognizedresult', noServer: true },
  );

  httpServer.on('upgrade', (request, socket, head) => {
    const pathname = request.url;

    if (pathname === '/airafacelite/verifyresults') {
      global.spiderman.systemlog.generateLog(4, 'create http websocket path=[/airafacelite/verifyresults]');
      wsVerifyresults.handleUpgrade(request, socket, head, (ws) => {
        wsVerifyresults.emit('connection', ws, request);
      });
    } else if (pathname === '/fcsrecognizedresult') {
      global.spiderman.systemlog.generateLog(4, 'create http websocket path=[/fcsrecognizedresult]');
      wsRecognized.handleUpgrade(request, socket, head, (ws) => {
        wsRecognized.emit('connection', ws, request);
      });
    } else if (pathname === '/fcsnonrecognizedresult') {
      global.spiderman.systemlog.generateLog(4, 'create http websocket path=[/fcsnonrecognizedresult]');
      wsNonrecognized.handleUpgrade(request, socket, head, (ws) => {
        wsNonrecognized.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  httpsServer.on('upgrade', (request, socket, head) => {
    const pathname = request.url;

    if (pathname === '/airafacelite/verifyresults') {
      global.spiderman.systemlog.generateLog(4, 'create https websocket path=[/airafacelite/verifyresults]');
      wsVerifyresults.handleUpgrade(request, socket, head, (ws) => {
        wsVerifyresults.emit('connection', ws, request);
      });
    } else if (pathname === '/fcsrecognizedresult') {
      global.spiderman.systemlog.generateLog(4, 'create https websocket path=[/fcsrecognizedresult]');
      wsRecognized.handleUpgrade(request, socket, head, (ws) => {
        wsRecognized.emit('connection', ws, request);
      });
    } else if (pathname === '/fcsnonrecognizedresult') {
      global.spiderman.systemlog.generateLog(4, 'create https websocket path=[/fcsnonrecognizedresult]');
      wsNonrecognized.handleUpgrade(request, socket, head, (ws) => {
        wsNonrecognized.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  return {
    http: httpServer,
    https: httpsServer,
    wsVerifyresults,
    wsRecognized,
    wsNonrecognized,
  };
}
)();

global.domain = domain.init();
global.domain.initdb.init();
global.runtimcache = runtimcache.init();
require('./interface/init')();
