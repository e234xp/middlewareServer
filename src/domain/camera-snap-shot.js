const fs = require('fs');
const { exec } = require('child_process');

function execute(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (stderr) {
      global.spiderman.systemlog.generateLog(2, `domain camera-snap-shot ${stderr}`);

      callback(stderr);
    } else {
      global.spiderman.systemlog.generateLog(2, `domain camera-snap-shot ${stdout}`);

      callback(stdout);
    }
  });
}

module.exports = () => {
  let isRunning = false;

  function get({
    url, uuid,
  }) {
    global.spiderman.systemlog.generateLog(4, `domain camera-snap-shot ${url}`);

    if (isRunning) {
      global.spiderman.systemlog.generateLog(4, 'domain camera-snap-shot still running.');
      throw Error('domain camera-snap-shot still running');
    }

    return new Promise((resolve) => {
      isRunning = true;

      const saveFolder = `${global.params.dataPath}/camera-snap-shots`;

      if (!fs.existsSync(saveFolder)) {
        fs.mkdirSync(saveFolder);
      }

      const filePath = `${saveFolder}/${uuid}.jpg`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const rtsp = url.includes('rtsp://');
      if (rtsp) {
        global.spiderman.systemlog.generateLog(4, `domain camera-snap-shot ffmpeg -i '${url}' -f image2 -vframes 1 '${filePath}'`);

        execute(
          `ffmpeg -i '${url}' -f image2 -vframes 1 '${filePath}'`,
          () => {
            let base64 = '';
            if (fs.existsSync(filePath)) {
              base64 = fs.readFileSync(filePath, 'base64');

              fs.unlinkSync(filePath);
            }

            isRunning = false;
            resolve(base64);
          },
        );
      } else {
        const sdp = url.includes('sdp://');
        if (sdp) {
          const sdpData = url.replace('sdp://', '');
          const sdpCfg = `${saveFolder}/${uuid}.sdp`;
          if (fs.existsSync(sdpCfg)) {
            fs.unlinkSync(sdpCfg);
          }
          fs.writeFileSync(sdpCfg, sdpData);
          if (fs.existsSync(sdpCfg)) {
            global.spiderman.systemlog.generateLog(4, `domain camera-snap-shot -i '${sdpCfg}' '${filePath}'`);

            execute(
              `ffmpeg -protocol_whitelist "file,udp,rtp" -i '${sdpCfg}' -f image2 -vframes 1 '${filePath}'`,
              () => {
                let base64 = '';
                if (fs.existsSync(filePath)) {
                  base64 = fs.readFileSync(filePath, 'base64');
                  fs.unlinkSync(filePath);
                }
                fs.unlinkSync(sdpCfg);

                isRunning = false;
                resolve(base64);
              },
            );
          }
        }
      }
    });
  }

  return {
    isRunning,
    get,
  };
};
