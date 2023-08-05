const dna = require('./dna');

// 指定要列出檔案的資料夾路徑
module.exports = {
  init: () => {
    const abilities = {
      _: require('lodash'),
      calculate: require('./calculate')(),
      express: require('./express')(),
      facefeature: require('./facefeature')(),
      image: require('./image')(),
      parse: require('./parse')(),
      query: require('./query')(),
      request: require('./request')(),
      socket: require('./socket')(),
      tcp: require('./tcp')(),
      udp: require('./udp')(),
      systemlog: require('./systemlog')(),
      token: require('./token')(),
      validate: require('./validate')(),
      line: require('./line')(),
      mailer: require('./mailer')(),

      defaultdata: require('./defaultdata')(),
      db: require('./db')(dna.db),
    };

    return abilities;
  },
};
