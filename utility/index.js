const fs = require('fs');

// 指定要列出檔案的資料夾路徑
const FOLIDER_PATH = './utility';
module.exports = {
  init: () => {
    const utility = {};
    const files = fs.readdirSync(FOLIDER_PATH);

    const newFiles = files.filter((file) => file === 'validate.js' || file === 'calculate.js' || file === 'query.js');
    console.log(newFiles);

    newFiles.forEach((file) => {
      const name = file.split('.')[0];
      utility[name] = require(`./${file}`)();
    });

    return utility;
  },
};
