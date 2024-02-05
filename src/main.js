process.env.UV_THREADPOOL_SIZE = 128;
// 引入 .env
require('dotenv').config();

// const parse = require('url');

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

global.params = generateParams(argObject);
function generateParams({
  fileroot = '/home/aira/product',
  localhost = '127.0.0.1:8588',
  // localhost = '192.168.10.122:8588',
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
  };
}

const spiderman = require('./spiderman/index');
const domain = require('./domain/index');
const runtimcache = require('./runtimcache/index');

global.spiderman = spiderman.init();

process.on('uncaughtException', (err) => {
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
  const httpServer = global.spiderman.express.createAndListenServer(http, 80, expressApp);
  const httpsServer = global.spiderman.express.createAndListenServer(https, 443, expressApp);

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
      wsVerifyresults.handleUpgrade(request, socket, head, (ws) => {
        wsVerifyresults.emit('connection', ws, request);
      });
    } else if (pathname === '/fcsrecognizedresult') {
      wsRecognized.handleUpgrade(request, socket, head, (ws) => {
        wsRecognized.emit('connection', ws, request);
      });
    } else if (pathname === '/fcsnonrecognizedresult') {
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
      wsVerifyresults.handleUpgrade(request, socket, head, (ws) => {
        wsVerifyresults.emit('connection', ws, request);
      });
    } else if (pathname === '/fcsrecognizedresult') {
      wsRecognized.handleUpgrade(request, socket, head, (ws) => {
        wsRecognized.emit('connection', ws, request);
      });
    } else if (pathname === '/fcsnonrecognizedresult') {
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

// const data = {
//   source_id: '3b17203c-cdb5-4bdb-8807-1c937be3c8b3',
//   verify_uuid: '670002dd-2d37-481f-9bc2-0851ddc98e68',
//   target_score: 0.85,
//   match: true,
//   timestamp: 1706759421114,
//   verify_mode: 0,
//   face_image: '/9j/4AAQSkZJRgABAQAAAQABAAD/',
//   is_stranger: false,
//   is_person: true,
//   verify_score: 0.8667039275169373,
//   person: {
//     uuid: 'e70db843-b8ed-492e-802f-650c46671eff',
//     id: 'A-0004',
//     name: 'YC',
//     card_facility_code: '',
//     card_number: '84325749',
//     group_list: ['New group', 'All Person'],
//     begin_date: 0,
//     expire_date: 0,
//     as_admin: false,
//     extra_info: {
//       title: 'RD',
//       department: 'Department-3',
//       email: 'merry@abc.com.tw',
//       phone_number: '0912345681',
//       extension_number: '1236',
//       remarks: 'undefined',
//     },
//     upper_face_feature: '',
//     create_date: 1706083594988,
//     last_modify_date: 1706083594988,
//     last_modify_date_by_manager: 1706083594988,
//   },
//   foreHead_temperature: 36,
//   is_high_temperature: false,
//   merged: false,
//   non_action: true,
// };

// global.domain.workerResult.triggerByResult(data);
