module.exports = () => {
  async function init() {
    const { db, defaultdata } = global.spiderman;

    let test = null;
    test = db.account.find();
    if (test == null || test.length === 0) db.account.set(defaultdata.account);

    test = db.groups.find();
    if (test == null || test.length === 0) db.groups.set(defaultdata.groups);

    test = db.videodevicegroups.find();
    if (test == null || test.length === 0) db.videodevicegroups.set(defaultdata.videodevicegroups);

    test = db.outputdevicegroups.find();
    if (test == null || test.length === 0) {
      db.outputdevicegroups.set(defaultdata.outputdevicegroups);
    }

    test = db.dashboardsettings.find();
    if (test == null || test.length === 0) db.dashboardsettings.set(defaultdata.dashboardsettings);

    test = db.attendancesettings.find();
    if (test == null || test.length === 0) {
      db.attendancesettings.set(defaultdata.attendancesettings);
    }

    test = db.managersettings.find();
    if (test == null || test.length === 0) db.managersettings.set(defaultdata.managersettings);

    test = db.person.find();
    if (test == null || test.length === 0) db.person.set([]);

    test = db.cameras.find();
    if (test == null || test.length === 0) db.cameras.set([]);

    test = db.tablets.find();
    if (test == null || test.length === 0) db.tablets.set([]);

    test = db.wiegandconverters.find();
    if (test == null || test.length === 0) db.wiegandconverters.set([]);

    test = db.ioboxes.find();
    if (test == null || test.length === 0) db.ioboxes.set([]);
  }

  return {
    init,
  };
};
