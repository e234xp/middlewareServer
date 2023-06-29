const fs = require('fs');

// 指定要列出檔案的資料夾路徑
const FOLIDER_PATH = `${process.cwd()}/domain`;
module.exports = {
  init: () => {
    const instance = {};
    const files = fs.readdirSync(FOLIDER_PATH);

    const newFiles = files.filter((file) => file !== 'index.js');
    newFiles.forEach((file) => {
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
