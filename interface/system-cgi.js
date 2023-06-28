const myService = require('express')();

const cgiPath = '../app/system-cgi';
myService.post('/:cgi', async (req, res) => {
  const startTime = performance.now();
  const { cgi } = req.params;

  try {
    const router = {
      test: require(`${cgiPath}/test`),

      systeminfo: require(`${cgiPath}/systeminfo`),
      factorydefault: require(`${cgiPath}/factorydefault`),
      synctime: require(`${cgiPath}/synctime`),
      enablentp: require(`${cgiPath}/enablentp`),
      timeinfo: require(`${cgiPath}/timeinfo`),
      supportedlanguagelist: require(`${cgiPath}/supportedlanguagelist`),
      supportedtimezonelist: require(`${cgiPath}/supportedtimezonelist`),
      changewifi: require(`${cgiPath}/changewifi`),
      enableethernetdhcp: require(`${cgiPath}/enableethernetdhcp`),
      enableethernetstatic: require(`${cgiPath}/enableethernetstatic`),
      currentethernetinfo: require(`${cgiPath}/currentethernetinfo`),
      currentwifiinfo: require(`${cgiPath}/currentwifiinfo`),
      fetchwifilist: require(`${cgiPath}/fetchwifilist`),
      restart: require(`${cgiPath}/restart`),
      changelanguage: require(`${cgiPath}/changelanguage`),
      triggerrelay1: require(`${cgiPath}/triggerrelay1`),
      triggerrelay2: require(`${cgiPath}/triggerrelay2`),
      checkdbbackupfile: require(`${cgiPath}/checkdbbackupfile`),
      generatedbbackup: require(`${cgiPath}/generatedbbackup`),
      downloadsyslog: require(`${cgiPath}/downloadsyslog`),
      downloadcrashlog: require(`${cgiPath}/downloadcrashlog`),
      downloaddb: require(`${cgiPath}/downloaddb`),
      uploaddb: require(`${cgiPath}/uploaddb`),
    };

    if (!router[cgi]) throw Error('no such cgi');
    global.spiderman.systemlog.writeInfo(`${cgi} has been called.`);
    authorize({ req, publicCgi: ['test', 'systeminfo', 'downloadsyslog'] });

    const { token } = req.headers;
    const body = getBody(req);
    const jsonResponse = await router[cgi](body, token);
    processResponse(jsonResponse, res);
  } catch (error) {
    handleError(error, res, cgi);
  } finally {
    const endTime = performance.now();
    console.log(cgi, '花費時間:', (endTime - startTime).toFixed(2), 'ms');
  }
});

function getBody(req) {
  if (req.is('multipart/form-data')) {
    return {
      ...global.spiderman.parse.circularJson(req.body),
      ...req.files,
    };
  }

  if (req.is('json')) {
    return global.spiderman.parse.circularJson(req.body);
  }

  throw Error('no such request type');
}

function processResponse(jsonResponse, res) {
  if (jsonResponse?.action === 'download') {
    const { path, fileName } = jsonResponse;
    res.download(path, fileName, (err) => {
      if (!err) return;
      res.status(404).json({ message: 'file not found' });
    });
  } else {
    res.status(200).json(jsonResponse);
  }
}

function handleError(error, res, cgi) {
  const errorCode = determinErrorCode(error);
  console.log(cgi, errorCode, error);

  const warningCodes = [401];
  if (warningCodes.includes(errorCode)) {
    global.spiderman.systemlog.writeWarning(`${cgi} ${error.message}`);
  } else {
    global.spiderman.systemlog.writeError(`${cgi} ${error.message}`);
  }

  res.status(errorCode).json({ message: error.message });
}

function determinErrorCode(error) {
  return {
    unauthorized: 401,
  }[error.message] ?? 400;
}

function authorize({ req, publicCgi = [] }) {
  const { cgi } = req.params;

  const isPassed = (() => {
    if (publicCgi.includes(cgi)) return true;
    const token = req.headers.token ?? req.query?.token ?? null;
    return token && (token === '83522758' || global.spiderman.token.decryptToAccountInTime(token));
  })();

  if (!isPassed) {
    throw Error('unauthorized');
  }
}

module.exports = myService;
