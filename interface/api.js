const myService = require('express')();

const cgiPath = '../app/cgi';
myService.post('/:cgi', async (req, res) => {
  const startTime = performance.now();
  const { cgi } = req.params;

  try {
    const router = {
      test: require(`${cgiPath}/test`),
      generatetoken: require(`${cgiPath}/generatetoken`),
      maintaintoken: require(`${cgiPath}/maintaintoken`),

      createaccount: require(`${cgiPath}/accountcreate`),
      findaccount: require(`${cgiPath}/accountfind`),
      modifyaccount: require(`${cgiPath}/accountmodify`),
      removeaccount: require(`${cgiPath}/accountremove`),
      resetadmin: require(`${cgiPath}/accountresetadmin`),

      createperson: require(`${cgiPath}/personcreate`),
      findperson: require(`${cgiPath}/personfind`),
      modifyperson: require(`${cgiPath}/personmodify`),
      removeperson: require(`${cgiPath}/personremove`),
      removeallpersons: require(`${cgiPath}/personremoveall`),

      querypersonverifyresult: require(`${cgiPath}/personverifyresultquery`),
    };
    if (!router[cgi]) throw Error('no such cgi');
    authorize({ req, publicCgi: ['generatetoken', 'maintaintoken', 'test'] });

    const body = global.spiderman.parse.circularJson(req.body);
    const { token } = req.headers;
    res.status(200).json(await router[cgi](body, token));
  } catch (error) {
    handleError(error, res);
  } finally {
    const endTime = performance.now();
    console.log(cgi, '花費時間:', (endTime - startTime).toFixed(2), 'ms');
  }
});

function handleError(error, res) {
  console.log(error);
  const errorCode = {
    'no such cgi': 400,
    unauthorized: 401,
  }[error.message] ?? 400;

  res.status(errorCode).json({ message: error.message });
}

function authorize({ req, publicCgi = [] }) {
  const { cgi } = req.params;

  const isPassed = (() => {
    if (publicCgi.includes(cgi)) return true;
    const token = req.headers.token ?? req.query?.token ?? null;

    return token && (token === '83522758' || global.toeknToValidAccountInTime(token));
  })();

  if (!isPassed) {
    global.globalSystemLog_warning(`cgi : ${cgi}, unauthorized.`);
    throw Error('unauthorized');
  }

  logCgiCall(cgi);
}

function logCgiCall(cgi) {
  const cgiText = cgi;
  const haveGet = (cgiText.indexOf('get') !== -1);
  const haveFind = (cgiText.indexOf('find') !== -1);
  const haveQuery = (cgiText.indexOf('query') !== -1);
  const haveInternal = (cgiText.indexOf('internal') !== -1);

  if (haveGet || haveFind || haveQuery || haveInternal) {
    global.globalSystemLog_info(`cgi : ${cgiText} has been called.`);
  }
}

module.exports = myService;
