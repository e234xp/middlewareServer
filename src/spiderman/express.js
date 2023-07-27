const fileUpload = require('express-fileupload');

if (!process.env.SSL_KEY || !process.env.SSL_CERT) throw Error('please get .env file.');
const sslOptions = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT,
};

module.exports = () => {
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
    const server = createServer(serverType, port, app);
    server.listen(port, () => {});
    server.headersTimeout = 300000;
    return server;
  }

  function createServer(serverType, port, app) {
    if (port !== 1443) return serverType.createServer(app);

    return serverType.createServer(sslOptions, app);
  }

  return {
    useCors,
    useFileUpload,
    createAndListenServer,
  };
};
