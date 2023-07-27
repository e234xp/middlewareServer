module.exports = {
  init: () => {
    const instance = {};
    const files = [
      'group', 'person', 'verifyresult', 'device', 'crud',
      'camera', 'videodevicegroup',
      'wiegandconverter', 'iobox', 'outputdevicegroup',
      'initdb',
    ];

    files.forEach((file) => {
      const name = file.split('.')[0];
      instance[name] = require(`./${file}`)();
    });

    // 額外設定
    (() => {
      instance.visitor = require('./person')(global.spiderman.db.visitor);
    })();

    return instance;
  },
};
