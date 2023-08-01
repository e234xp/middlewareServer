module.exports = {
  init: () => {
    const instance = {
      group: require('./group')(),
      person: require('./person')(),
      visitor: require('./person')(global.spiderman.db.visitor),
      verifyresult: require('./verifyresult')(),
      device: require('./device')(),
      crud: require('./crud')(),
      camera: require('./camera')(),
      videodevicegroup: require('./videodevicegroup')(),
      wiegandconverter: require('./wiegandconverter')(),
      iobox: require('./iobox')(),
      outputdevicegroup: require('./outputdevicegroup')(),
      initdb: require('./initdb')(),

      workerIobox: require('./worker-iobox')(),
      workerResult: require('./worker-result')(),
    };

    return instance;
  },
};
