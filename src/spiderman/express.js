const fileUpload = require('express-fileupload');

module.exports = () => {
  function useLimitCgiNumber({ routesNeedToLimit = [] }) {
    return (req, res, next) => {
      const route = req.url.split('/')[1];
      if (!routesNeedToLimit.includes(route)) {
        next();
        return;
      }

      const { cgiCounter, maxCgiNumber } = global.params;
      if (cgiCounter + 1 > maxCgiNumber) {
        res.status(429).json({ message: 'Too Many Requests, server allows upto max 50 request concurrently.' });
        return;
      }

      global.params.cgiCounter += 1;

      req.on('close', () => {
        if (global.params.cgiCounter <= 0) {
          global.params.cgiCounter = 0;
          return;
        }

        global.params.cgiCounter -= 1;
      });

      next();
    };
  }

  function useCors() {
    return (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type,token');
      next();
    };
  }

  function useFileUpload({ uploadTimeout = 3000000, limitSize = 1024000000 } = {}) {
    const tempFileDir = `${global.params.fwPath}`;
    return fileUpload({
      uploadTimeout,
      createParentPath: true,
      useTempFiles: true,
      tempFileDir,
      limits: { fileSize: limitSize },
    });
  }

  function createAndListenServer(serverType, port, app) {
    serverType.globalAgent.maxSockets = 50;
    const server = serverType.createServer(app);
    server.listen(port, () => {});
    server.headersTimeout = 300000;
    return server;
  }

  return {
    useLimitCgiNumber,
    useCors,
    useFileUpload,
    createAndListenServer,
  };
};
