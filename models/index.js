const fs = require('fs');

// 指定要列出檔案的資料夾路徑
const folderPath = './models';
module.exports = {
  init: () => {
    const models = {};
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('無法讀取資料夾內容：', err);
        return;
      }

      const newFiles = files.filter((file) => (file !== 'index.js'));
      newFiles.forEach((file) => {
        const name = file.split('.')[0];
        models[name] = require(`./${file}`)();
      });
    });

    return models;
  },
};
