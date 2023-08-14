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
      tablet: require('./tablet')(),
      videodevicegroup: require('./videodevicegroup')(),
      wiegandconverter: require('./wiegandconverter')(),
      iobox: require('./iobox')(),
      outputdevicegroup: require('./outputdevicegroup')(),

      rule: require('./rule')(),
      schedule: require('./schedule')(),
      linecommand: require('./linecommand')(),
      emailcommand: require('./emailcommand')(),
      httpcommand: require('./httpcommand')(),

      workerIobox: require('./worker-iobox')(),
      workerWiegand: require('./worker-wiegand')(),
      workerResult: require('./worker-result')(),

      triggerLineCommand: require('./trigger-line-command')(),
      triggerEmailCommand: require('./trigger-email-command')(),
      triggerHttpCommand: require('./trigger-http-command')(),

      tabletverify: require('./tabletverify')(),

      cameraSnapShot: require('./camera-snap-shot')(),

      initdb: require('./initdb')(),
    };

    return instance;
  },
};
