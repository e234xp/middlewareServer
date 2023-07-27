module.exports = () => {
  async function init() {
    const { db, defaultdata } = global.spiderman;

    console.log(Object.keys(defaultdata));

    db.videodevicegroups.set(defaultdata.videodevicegroups);
    db.outputdevicegroups.set(defaultdata.outputdevicegroups);

    db.cameras.set([]);
    db.wiegandconverters.set([]);
    db.ioboxes.set([]);
  }

  return {
    init,
  };
};
