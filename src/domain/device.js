module.exports = () => {
  function findByName(name) {
    const result = {
      type: null,
      uuid: null,
    };

    // TODO device 加好加滿
    const camera = global.spiderman.db.cameras.findOne({ name });
    if (camera) {
      result.type = 'camera';
      result.uuid = camera.uuid;
      return result;
    }

    const wiegandconverter = global.spiderman.db.wiegandconverters.findOne({ name });
    if (wiegandconverter) {
      result.type = 'wiegandconverter';
      result.uuid = wiegandconverter.uuid;
      return result;
    }

    return null;
  }

  return {
    findByName,
  };
};
