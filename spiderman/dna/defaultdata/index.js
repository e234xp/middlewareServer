const fs = require('fs');

// 指定要列出檔案的資料夾路徑
const FOLIDER_PATH = `${process.cwd()}/spiderman/dna/defaultdata`;
module.exports = () => {
  const items = fs.readdirSync(FOLIDER_PATH);

  const filterdItems = items
    .filter((item) => item !== 'index.js');

  const defaultData = (() => {
    const tmp = {};

    filterdItems.forEach((item) => {
      const name = item.split('.')[0];
      tmp[name] = require(`./${item}`);
    });

    return tmp;
  })();

  return defaultData;
};
