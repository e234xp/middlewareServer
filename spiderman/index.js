const fs = require('fs');
const dna = require('./dna');

// 指定要列出檔案的資料夾路徑
const FOLIDER_PATH = __dirname;
module.exports = {
  init: () => {
    const abilities = {};
    const items = fs.readdirSync(FOLIDER_PATH);
    const filterdItems = items.filter((item) => item !== 'index.js' && item !== 'dna');
    filterdItems.forEach((item) => {
      const name = item.split('.')[0];
      if (Object.keys(dna).includes(name)) {
        const onDna = dna[name];
        abilities[name] = require(`./${name}`)(onDna);
      } else {
        abilities[name] = require(`./${name}`)();
      }
    });

    return abilities;
  },
};
