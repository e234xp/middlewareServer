const fs = require('fs');
const { exec } = require('child_process');

function execute(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (stderr) {
      callback(stderr);
    } else {
      callback(stdout);
    }
  });
}

module.exports = () => {
  function get({
    url, uuid,
  }) {
    return new Promise((resolve) => {
      const saveFolder = `${global.params.dataPath}/camera-snap-shots`;
      if (!fs.existsSync(saveFolder)) {
        fs.mkdirSync(saveFolder);
      }

      const filePath = `${saveFolder}/${uuid}.jpg`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      execute(
        `ffmpeg -rtsp_transport tcp -i ${url} -f image2 -vframes 1 ${filePath}`,
        () => {
          let base64 = '';

          if (fs.existsSync(filePath)) {
            base64 = fs.readFileSync(filePath, 'base64');
          }
          fs.unlinkSync(filePath);

          resolve(base64);
        },
      );
    });
  }

  return {
    get,
  };
};
