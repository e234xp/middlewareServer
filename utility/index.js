const fs = require('fs');

// 指定要列出檔案的資料夾路徑
const folderPath = './utility';
module.exports = {
  init: () => {
    const utility = {};
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('無法讀取資料夾內容：', err);
        return;
      }

      const newFiles = files.filter((file) => (file !== 'index.js') && (file === 'validate.js'));

      newFiles.forEach((file) => {
        const name = file.split('.')[0];
        utility[name] = require(`./${file}`)();
      });
    });

    return utility;
  },
};
