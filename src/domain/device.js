module.exports = () => {
  function findByName(name) {
    const result = {
      type: null,
      uuid: null,
    };

    // TODO tablet
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

    const iobox = global.spiderman.db.ioboxes.findOne({ name });
    if (iobox) {
      result.type = 'iobox';
      result.uuid = iobox.uuid;
      return result;
    }

    return null;
  }

  return {
    findByName,
  };
};
