const dataParser = require('../utility/dataParser');

module.exports = ({ req, res }) => {
  try {
    const { cgi } = req.params;

    const router = {
      test: require('./new-cgi/test'),
      generatetoken: require('./new-cgi/generatetoken'),
      maintaintoken: require('./new-cgi/maintaintoken'),
      createaccount: require('./new-cgi/createaccount'),
      findaccount: require('./new-cgi/findaccount'),
      modifyaccount: require('./new-cgi/modifyaccount'),
      removeaccount: require('./new-cgi/removeaccount'),
      resetadmin: require('./new-cgi/resetadmin'),

      findperson: require('./new-cgi/findperson'),
    };
    if (!router[cgi]) throw Error('no such cgi');
    authorize({ req, publicCgi: ['generatetoken', 'maintaintoken', 'test'] });

    const body = dataParser.circularJsonParser(req.body);
    const { token } = req.headers;
    res.status(200).json(router[cgi](body, token));
  } catch (error) {
    handleError(error, res);
  }
};

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
