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
    };

    if (!router[cgi]) throw Error('no such cgi');
    authorize({ req, publicCgi: ['test', 'systeminfo'] });
    global.spiderman.systemlog.writeInfo(`${cgi} has been called.`);

    const body = global.spiderman.parse.circularJson(req.body);
    const { token } = req.headers;

    res.status(200).json(await router[cgi](body, token));
  } catch (error) {
    handleError(error, res, cgi);
  } finally {
    const endTime = performance.now();
    console.log(cgi, '花費時間:', (endTime - startTime).toFixed(2), 'ms');
  }
});

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
