process.env.UV_THREADPOOL_SIZE = 128;

const express = require('express');

const expressApp = express();
const fileUpload = require('express-fileupload');
const http = require('http');
const https = require('https');
const airaFaceLiteAccountDb = require('./service/airaFaceLiteAccountDb');
const airaFaceLiteSettings = require('./service/airaFaceLiteSettings');
const airaFaceLitePersonDb = require('./service/airaFaceLitePersonDb');
const airaFaceLiteGroupSettings = require('./service/airaFaceLiteGroupSettings');
const airaFaceLiteEventSettings = require('./service/airaFaceLiteEventSettings');
const airaTabletLiteVerifyResultReader = require('./service/airaTabletLiteVerifyResultReader');
const airaTabletLiteSystemLogReader = require('./service/airaTabletLiteSystemLogReader');
const verifyResultReportService = require('./service/verifyResultReportService');
const airaFaceLiteDashboardSettings = require('./service/airaFaceLiteDashboardSettings');
const airaFaceLiteAttendanceSettings = require('./service/airaFaceLiteAttendanceSettings');

const airaFaceLiteManagerSettings = require('./service/airaFaceLiteManagerSettings');

const interfaceApi = require('./interface/api');
const apiServiceAiraFaceLite = require('./service/apiServiceAiraFaceLite');
const apiSystemAiraFaceLite = require('./service/apiSystemAiraFaceLite');

const spiderman = require('./spiderman/index');

global.spiderman = spiderman.init();

const domain = require('./domain/index');

global.domain = domain.init();

expressApp.use(express.json({ limit: '50mb' }));
expressApp.use(express.text({ limit: '50mb' }));
// expressApp.use( fileUpload( { limits: { fileSize : 1024000000 } }) ); // 1gb

expressApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,token');
  next();
});

global.fileroot = '/userdata/aira';
global.localhost = '127.0.0.1:8588';
let _dev_mode = false;
process.argv.forEach((val, index, array) => {
  console.log(`${index}: ${val}`);
  const param = val.split('=');
  if (param[0] == 'dev') {
    if (param[1] == 'true') {
      _dev_mode = true;
      console.log('_dev_mode as true');
    } else if (param[1] == 'false') {
      _dev_mode = false;
      console.log('_dev_mode as false');
    }
  }
  if (param[0] == 'target_host') {
    target_host = param[1];
  }
  if (param[0] == 'fileroot') {
    global.fileroot = param[1];
    console.log('global.fileroot', global.fileroot);
  }
});
const root_path = global.fileroot;

const data_root_path = `${root_path}/data`;
const sw_root_path = `${root_path}/sw`;
const fw_root_path = `${root_path}/fw`;

global.fwPath = fw_root_path;
global.fwFullName = `${fw_root_path}/sw_upgrade_image.airasoft`;

global.importPath = `${data_root_path}/import`;
global.dbAccountPath = `${data_root_path}/account`;
global.dbPath = `${data_root_path}/db`;
global.personVerifyResultPath = `${data_root_path}/personverifyresult`;
global.visitorVerifyResultPath = `${data_root_path}/visitorverifyresult`;
global.nonVerifyResultPath = `${data_root_path}/nonverifyresult`;
global.systemLogPath = `${data_root_path}/systemlog`;
global.dbBackupFileName = `${data_root_path}/dbbak.dbf`;

expressApp.use(fileUpload({
  uploadTimeout: 3000000,
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: global.fwPath,
  limits: { fileSize: 1024000000 },
}));

// global.engineGenerateFaceFeatureUrl = "http://127.0.0.1:8588/system/generatefacefeature";
global.engineGenerateFaceFeature = function (base64Image, cb) {
  return new Promise((resolve) => {
    require('request')({
      url: `http://${global.localhost}/system/generatefacefeature`,
      method: 'POST',
      pool: { maxSockets: 10 },
      time: true,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
      json: { base64_image: base64Image },
    }, (error, response, body) => {
      try {
        if (cb) {
          cb(
            error,
            (body != null && body.face_image != null) ? body.face_image : '',
            (body != null && body.face_feature != null) ? body.face_feature : '',
            (body != null && body.upper_face_feature != null) ? body.upper_face_feature : '',
          );
        }
      } catch (e) {}
      // if( error ) console.log( "body : ", error, body  );
      resolve({
        error,
        face_image: (body != null && body.face_image != null) ? body.face_image : '',
        face_feature: (body != null && body.face_feature != null) ? body.face_feature : '',
        upper_face_feature: (body != null && body.upper_face_feature != null) ? body.upper_face_feature : '',
      });
    });
  });
};

global.resizeImage = async function (base64Image, cb) {
  return new Promise((resolve) => {
    require('request')({
      url: `http://${global.localhost}/system/resizeimage`,
      method: 'POST',
      pool: { maxSockets: 10 },
      time: true,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
      json: { base64_image: base64Image },
    }, (error, response, body) => {
      try {
        if (cb) cb(error, (body != null && body.base64_image != null) ? body.base64_image : '');
      } catch (e) {}
      resolve({ error: error != null ? error : 'error', base64_image: (body != null && body.base64_image != null) ? body.base64_image : '' });
    });
  });
  // require('request').post( "http://127.0.0.1:8588/system/generatefacefeature", {json : { base64_image : base64Image } }, function (error, response, body) {
  //   try {
  //     if( cb ) cb( error, body.face_image, body.face_feature );
  //   }
  //   catch(e){}
  // });
};

function writeSystemLog(type, dataString, cb) {
  require('request')({
    url: `http://${global.localhost}/system/writelog`,
    method: 'POST',
    pool: { maxSockets: 10 },
    time: true,
    timeout: 3000,
    headers: {
      'Content-Type': 'application/json',
    },
    json: { log_type: type, log_string: dataString },
  }, (error, response, body) => {
    try {
      if (cb) cb();
    } catch (e) {}
  });
}

global.globalSystemLog_info = function (dataString, cb) {
  writeSystemLog('info', dataString, cb);
};
global.globalSystemLog_warning = function (dataString, cb) {
  writeSystemLog('warning', dataString, cb);
};
global.globalSystemLog_error = function (dataString, cb) {
  writeSystemLog('error', dataString, cb);
};

const tokenKey = 'aira83522758';
global.encryptAccountToToken = (text) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const byteHex = (n) => (`0${Number(n).toString(16)}`).substr(-2);
  const applySaltToChar = (code) => textToChars(tokenKey).reduce((a, b) => a ^ b, code);
  return text
    .split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
};

global.decryptToeknToAccount = (encoded) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) => textToChars(tokenKey).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join('');
};

global.encryptAccountToTokenWithKey = (key, text) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const byteHex = (n) => (`0${Number(n).toString(16)}`).substr(-2);
  const applySaltToChar = (code) => textToChars(key).reduce((a, b) => a ^ b, code);
  return text
    .split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
};

global.decryptToeknToAccountWithKey = (key, encoded) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) => textToChars(key).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join('');
};

function getLang(cb) {
  return new Promise((resolve) => {
    require('request')({
      url: `http://${global.localhost}/system/supportedlanguagelist`,
      method: 'POST',
      pool: { maxSockets: 10 },
      time: true,
      timeout: 5000,
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        'Content-Type': 'application/json',
      },
      json: {},
    }, (error, response, body) => {
      let l = 'zh';
      if (body) {
        const langData = body;
        try {
          const activeLangList = langData.list.filter((lang) => lang.active === true);
          if (activeLangList.length > 0) {
            l = activeLangList[0].language;
          }
        } catch (e) {}
      }
      if (cb) cb(l);
      resolve(l);
    });
  });
}

let lastLang = 'en';
getLang((l) => {
  lastLang = l;
});

global.changeLang = (l) => {
  lastLang = l || 'en';
};
global.checkLang = () => lastLang;

global.initdb = function () {
  global.airaFaceLiteSettings = new airaFaceLiteSettings(global.dbPath, 'settings.db');
  global.airaFaceLiteGroupSettings = new airaFaceLiteGroupSettings(global.dbPath, 'groups.db');
  global.airaFaceLiteEventSettings = new airaFaceLiteEventSettings(global.dbPath, 'eventsettings.db');
  global.airaFaceLiteDashboardSettings = new airaFaceLiteDashboardSettings(global.dbPath, 'dashboardsettings.db');
  global.airaFaceLiteAttendanceSettings = new airaFaceLiteAttendanceSettings(global.dbPath, 'attendancesettings.db');
  global.airaFaceLiteManagerSettings = new airaFaceLiteManagerSettings(global.dbPath, 'managersettings.db');

  global.airaFaceLitePersonDb = new airaFaceLitePersonDb(global.dbPath, 'person.db', 864000000 * 63);
  global.airaFaceLiteVisitorDb = new airaFaceLitePersonDb(global.dbPath, 'visitor.db', 864000000 * 7);
  // global.airaFaceLiteAccessControlScheduleSettings = new airaFaceLiteGroupSettings( global.dbPath, "acsSettings.db" );
};

global.lockdb = function () {
  // global.airaFaceLiteAccountDb.lock();
  global.airaFaceLiteSettings.lock();
  global.airaFaceLiteGroupSettings.lock();
  global.airaFaceLitePersonDb.lock();
  global.airaFaceLiteVisitorDb.lock();
  global.airaFaceLiteDashboardSettings.lock();
  // global.airaFaceLiteAccessControlScheduleSettings.lock();
};

global.unlockdb = function () {
  // global.airaFaceLiteAccountDb.unlock();
  global.airaFaceLiteSettings.unlock();
  global.airaFaceLiteGroupSettings.unlock();
  global.airaFaceLitePersonDb.unlock();
  global.airaFaceLiteVisitorDb.unlock();
  global.airaFaceLiteDashboardSettings.unlock();
  // global.airaFaceLiteAccessControlScheduleSettings.unlock();
};

global.autolockdb = async function (cb) {
  global.lockdb();
  if (cb) cb();
  global.initdb();
  global.unlockdb();
};

global.airaTabletLitePersonVerifyResultReader = new airaTabletLiteVerifyResultReader(global.personVerifyResultPath);
global.airaTabletLiteVisitorVerifyResultReader = new airaTabletLiteVerifyResultReader(global.visitorVerifyResultPath);
global.airaTabletLiteNonVerifyResultReader = new airaTabletLiteVerifyResultReader(global.nonVerifyResultPath);

global.airaTabletLiteSystemLogReader = new airaTabletLiteSystemLogReader(global.systemLogPath);
global.initdb();
global.airaFaceLiteAccountDb = new airaFaceLiteAccountDb(global.dbAccountPath, 'account.db');

global.toeknToValidAccountInTime = function (token) {
  try {
    const accountData = JSON.parse(global.decryptToeknToAccount(token));
    // console.log( accountData.t, (accountData.t + 300000), Date.now() )
    if ((accountData.t + 300000) > Date.now()) {
      return accountData;
    }
  } catch (e) {}
  return null;
};

const sslOptions = {
  key:
`-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDj6A8fa+3VF1mk
FQaSrbRtDhZOkd9D+CrQD2gxIMYy0Fog1opjFegDbmif2XthFyTriF1kHsh549DM
jkKZpgxnWzo1JiG/GqiDdhBGImqN5/9cE0hOW1VpLFJF39gfgeOiJLP6yhEJi+vE
1LqzMP6lo2q/6k2xfYpxpawZ0zphCdV/5gX1Dbgb/SKKeZrucrzxjrPtWgLKHWZs
zJn4EV0/9Tb6GcPK4zcTaejuUtXTZzMswuXWXOLc360iTt5fb9diTmBtXgO1bGZ9
J0fpaw5zBWIzUOLefNZawoSsJfQf8Iuu8ERsgAvqeVR8qW7a7kBaQYrhytGUf7Jv
DQV4JxI7AgMBAAECggEBALBTCeA1kHwc5K2d1sgEvGLjUz7WfPYJOpZeVS4tPSpz
KEfftJGUkTyWXzvM9zfWwCm6Bwc/CbvEFfcs2TomzdHpMs+MAO/poBaVcWHRnr7L
jzWddYOqBhqov75vwLYfuA3qd5TAYQ4Rwwc1znx0m49rL1vr2tBHYKUsmEoisjf/
/fltOgb3X2nmBpmVmkNjr8tqPK+058yhx/tLs4kT8rcHFMZwXNVr64WrXvN47saG
ZH11THOC1nhVh5ru+32dvPZeWeZ3dKPfLnxMP3fE0k3WZjTZUDwX05dHsTby6xcx
eAQzUMyCCire98WOc+aQwYPx6WUG/iYC1gDq2nQvY4ECgYEA82Q8+QL1Wc10xxkz
yuGi9s6IYIppwPhr2aUQurxyS1DbCDxyIrwTUW6GuIe2oXQe/AkZJx4h2rHPKjdJ
2JBw5INN1yf4AY1GXITr5dsJAkX5Lc7/+lVYvUskNZXW3XTO4qN+mgZWsytRvubv
nUxqURVK5aXKoAhFA6LLpPwd498CgYEA77Z2yU86/e0+Mj7NggypECNgwuWi/bYt
2dyOo8C2mVnY7nNPEyyoTw6thq61jxgBeZqbPCFpwS9JDzwsQCaZMKYnojVljGZA
SAiTnnYWD6Ldkpu8PiNQcvn+Ev3kSJ8xaruS146zNXXWtSXkLoMZ/OXddGgbKK1D
q3eCl4CXPSUCgYBKBRMR+9dYD0bTghOhQMvJ2XfaPF37JNHP6AZVdBgiVZ23PILN
k3sgiceI+SUOpv0BU1cF8YEEPI0vXo8jwJHEvTYAGBSxjCB45KfFSL7NpTApwUlR
/YC2WNLTRRWKVgrRHD3VY9YcOTFsKFl48hNnQ116x9f+oWUzvN/H9jC06wKBgFA5
Q4XZ00daF5+fLw3gCNCS1nZDfgnk53FrA/2/qByoWhZrVsJ3Bpj2s5JIdBDAmvXE
jUFReWAi4BOOMs0BXfFPGiKKNkMHkWnKHQVCRd3Txs2i+xvcm7bu/V4DxFudk19C
CUHEyysQFdwoIzaBv7fIghXMJZK2cdg3tefYLEVVAoGATc6guqPbo2U+OtkigI5R
1lDZNe2yrXgIDaUuDIKyg4+gLkdafmhWOiyoxljrKWgki5s0ofiQQF3tSTj2cuPD
47EYE4GTQD4WhyGegRQ0MPfgjfqqfosb4RSjsSlaNXb3eBqHqdFck9lsDO/4RihX
gPjiEm9cPABflqudBuKO2kE=
-----END PRIVATE KEY-----
`,
  cert:
`-----BEGIN CERTIFICATE-----
MIID/zCCAuegAwIBAgIJAOWRMu1I01KiMA0GCSqGSIb3DQEBCwUAMIGhMQswCQYD
VQQGEwJUVzEPMA0GA1UECBMGVGFpd2FuMQ8wDQYDVQQHEwZUYWlwZWkxGTAXBgNV
BAoTEEFJUkEgQ29ycG9yYXRpb24xGTAXBgNVBAsTEEFJUkEgQ29ycG9yYXRpb24x
GDAWBgNVBAMTD2FpcmFUYWJsZXQgbWluaTEgMB4GCSqGSIb3DQEJARYRc2FsZXNA
YWlyYS5jb20udHcwIBcNMjEwOTE2MDQwNjU5WhgPMjA3NjA2MTkwNDA2NTlaMIGh
MQswCQYDVQQGEwJUVzEPMA0GA1UECBMGVGFpd2FuMQ8wDQYDVQQHEwZUYWlwZWkx
GTAXBgNVBAoTEEFJUkEgQ29ycG9yYXRpb24xGTAXBgNVBAsTEEFJUkEgQ29ycG9y
YXRpb24xGDAWBgNVBAMTD2FpcmFUYWJsZXQgbWluaTEgMB4GCSqGSIb3DQEJARYR
c2FsZXNAYWlyYS5jb20udHcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
AQDj6A8fa+3VF1mkFQaSrbRtDhZOkd9D+CrQD2gxIMYy0Fog1opjFegDbmif2Xth
FyTriF1kHsh549DMjkKZpgxnWzo1JiG/GqiDdhBGImqN5/9cE0hOW1VpLFJF39gf
geOiJLP6yhEJi+vE1LqzMP6lo2q/6k2xfYpxpawZ0zphCdV/5gX1Dbgb/SKKeZru
crzxjrPtWgLKHWZszJn4EV0/9Tb6GcPK4zcTaejuUtXTZzMswuXWXOLc360iTt5f
b9diTmBtXgO1bGZ9J0fpaw5zBWIzUOLefNZawoSsJfQf8Iuu8ERsgAvqeVR8qW7a
7kBaQYrhytGUf7JvDQV4JxI7AgMBAAGjNjA0MB0GA1UdEQQWMBSCEmEuc3BlY3Ry
b2Nsb3VkLmNvbTATBgNVHSUEDDAKBggrBgEFBQcDATANBgkqhkiG9w0BAQsFAAOC
AQEAprK0Fc1yMlCRrfC/c/3uStqBUxyx1Y2nirDm88zIfVKsshLo7sU9N28fCfMx
vc14WwRHkhxY/PEH565yxI3a3AE6DRChECkd6bkc0dbkuC9pKdH3wQOj21tsG3iO
6hKI1hQ4WF+7Qy1+raLB3zX8Q0Hu7zLFXnXXwLQ+esTAuWu9IhRrLG5VC54PoDsY
qeTQkAbO4R6Fr+CNAF59ACl6j/p9aVtwJCAARidUxEAJVvHyhGi9EkmpOUCYS/L4
LOEvtJP5HusCtsDeiiGbmJD9kgWGhC5MI5hm0pxGOJ+U5/+fBpfk6eJU36FrZ2XU
uNJRRuzG94By+yipQf7us1JHNA==
-----END CERTIFICATE-----
`,
};

global.cgiProtectionCounter = 0;
const options = sslOptions;

http.globalAgent.maxSockets = 50;
const httpServer = http.createServer(expressApp);
https.globalAgent.maxSockets = 50;
const httpsServer = https.createServer(options, expressApp);

if (_dev_mode) {
  expressApp.use(express.static('/Users/ken/tmp/main_service_server/dist'));
  httpServer.listen(8080, () => {});
  httpsServer.listen(8443, () => {});
} else {
  expressApp.use('/airafacelite', apiServiceAiraFaceLite);
  expressApp.use('/airafacelite', interfaceApi);
  expressApp.use('/system', apiSystemAiraFaceLite);
  expressApp.use(express.static(`${sw_root_path}/wwwdist`));
  // expressHttpApp.use( '*', function(req, res) {
  //   res.redirect('https://' + req.headers.host + ":8443" + req.url);
  // });
  // expressHttpApp.enable('trust proxy')
  // expressHttpApp.use((req, res, next) => {
  //     req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
  // })
  httpServer.listen(80, () => {});
  httpsServer.listen(443, () => {});

  httpServer.headersTimeout = 300000;
  httpsServer.headersTimeout = 300000;
  // httpsServer.on( 'connection', function(socket) {
  //     socket.setTimeout( 300000 );
  // });
  process.on('uncaughtException', (err) => {
    console.log('system UCE : ', err.toString());
  });
}

global.verifyResultReportService_nonSsl = new verifyResultReportService(httpServer, '/airafacelite/verifyresults');
global.verifyResultReportService = new verifyResultReportService(httpsServer, '/airafacelite/verifyresults');

const edgeDeviceServiceHandler = require('./service/edgeDeviceServiceHandler');

global.edgeDeviceServiceHandlerDaemon = new edgeDeviceServiceHandler();
global.edgeDeviceServiceHandlerDaemon.run(global.dbPath);

// const upnpserver = require("upnpserver");
// const upnpConfig = {
//   name : "airaTablet xs",
//   modelName : "airaTablet xs",
//   manufacturer : "AIRA Corporation",
//   manufacturerURL : "https://www.aira.com.tw",
//   modelNumber : "TBT-2300(2301)",
//   servicePath : "/",
//   servicePort : 80
// };

// // upnpConfig["uuid"] = "Not activated yet.";
// // upnpConfig["serialNumber"] = "Not activated yet.";
// upnpConfig["type"] = "urn:airatabletxs:1";

// const upnpServer = new upnpserver( upnpConfig, "" );
// upnpServer.start( function(error) {
//   if( error ) console.log( error.message );
//   else console.log( "upnp started." );
// });
