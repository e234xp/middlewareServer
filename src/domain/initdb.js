module.exports = () => {
  async function init() {
    const { db, defaultdata } = global.spiderman;

    db.account.set(defaultdata.account);
    db.groups.set(defaultdata.groups);
    db.videodevicegroups.set(defaultdata.videodevicegroups);
    db.outputdevicegroups.set(defaultdata.outputdevicegroups);

    db.cameras.set([]);
    db.tablets.set([]);
    db.wiegandconverters.set([]);
    db.ioboxes.set([]);
  }

  return {
    init,
  };
};
