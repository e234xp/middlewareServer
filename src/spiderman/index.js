const dna = require('./dna');

// 指定要列出檔案的資料夾路徑
module.exports = {
  init: () => {
    const abilities = {};
    const items = [
      'calculate.js', 'db',
      'express.js', 'facefeature.js',
      'image.js', 'parse.js',
      'query.js', 'request.js',
      'socket.js', 'systemlog.js',
      'token.js', 'validate.js',
      'defaultdata.js',
    ];
    items.forEach((item) => {
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
