process.env.UV_THREADPOOL_SIZE = 128;

const express = require('express');
const http = require('http');
const https = require('https');

const apiInterface = require('./interface/api');
const apiSystemAiraFaceLite = require('./service/apiSystemAiraFaceLite');
const spiderman = require('./spiderman/index');
const domain = require('./domain/index');

global.spiderman = spiderman.init();
global.domain = domain.init();

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
  const param = val.split('=');
  const [key, value] = param;

  switch (key) {
    case 'fileroot': {
      global.spiderman.param[key] = value;
      break;
    }

    default: {
      break;
    }
  }
});

process.on('uncaughtException', (err) => {
  // TODO 拿掉 ECONNREFUSED
  if (err.code === 'ECONNREFUSED') {
    return;
  }

  console.log('system UCE : ', err);
});

const expressApp = express()
  .use(express.json({ limit: '50mb' }))
  .use(express.text({ limit: '50mb' }))
  .use(global.spiderman.express.useLimitCgiNumber({ routesNeedToLimit: ['airafacelite', 'system'] }))
  .use(global.spiderman.express.useCors())
  .use(global.spiderman.express.useFileUpload())
  .use('/airafacelite', apiInterface)
  .use('/system', apiSystemAiraFaceLite)
  .use(express.static(`${global.spiderman.param.fileroot}${global.spiderman.param.swPath}/wwwdist`));

const httpServer = global.spiderman.express.createAndListenServer(http, 80, expressApp);
const httpsServer = global.spiderman.express.createAndListenServer(https, 443, expressApp);

// TODO 進行整理
const VerifyResultReportService = require('./service/verifyResultReportService');

global.verifyResultReportService_nonSsl = new VerifyResultReportService(httpServer, '/airafacelite/verifyresults');
global.verifyResultReportService = new VerifyResultReportService(httpsServer, '/airafacelite/verifyresults');
