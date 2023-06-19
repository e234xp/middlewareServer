module.exports = () => {
  function fetchPhoto({ uuid, f }) {
    const [type] = f.split('_');
    switch (type) {
      case 'pvr': {
        return global.spiderman.db.personverifyresultphoto.findOne(`${f}.db_photos/${uuid}.photo`);
      }

      case 'vvr': {
        return global.spiderman.db.visitorverifyresultphoto.findOne(`${f}.db_photos/${uuid}.photo`);
      }

      case 'nvr': {
        return global.spiderman.db.nonverifyresultphoto.findOne(`${f}.db_photos/${uuid}.photo`);
      }

      default: {
        throw Error('Unknown photo type');
      }
    }
  }

  return {
    fetchPhoto,
  };
};
