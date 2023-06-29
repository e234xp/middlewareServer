module.exports = (route) => {
  const myService = require('express')();
  const { publicCgi, router } = require(`.${route}`)();

  myService.post('/:cgi', async (req, res) => {
    const startTime = performance.now();
    const { cgi } = req.params;

    try {
      if (!router[cgi]) throw Error('no such cgi');
      global.spiderman.systemlog.writeInfo(`${cgi} has been called.`);
      authorize({ req, publicCgi });

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

  return myService;
};

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
