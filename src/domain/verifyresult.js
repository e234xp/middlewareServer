module.exports = () => {
  function queryResults({
    collection, startTime, endTime, query,
  }) {
    const collections = [
      'personverifyresult',
      'visitorverifyresult',
      'nonverifyresult',
    ];
    if (!collection || !collections.includes(collection)) throw Error('Unknown collection');

    return global.spiderman.db[collection]
      .find({
        startTime,
        endTime,
        query,
      });
  }

  function fetchPhoto({ uuid, f }) {
    const collection = (() => {
      const [type] = f.split('_');
      const typeToCollection = {
        pvr: 'personverifyresultphoto',
        vvr: 'visitorverifyresultphoto',
        nvr: 'nonverifyresultphoto',
      };

      return typeToCollection[type];
    })();

    if (!collection) throw Error('System: unknown photo type');

    return global.spiderman.db[collection].findOne(`${f}.db_photos/${uuid}.photo`);
  }

  return {
    queryResults,
    fetchPhoto,
  };
};
