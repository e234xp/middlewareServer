// const fieldChecks = [];

module.exports = () => {
  // data = global.spiderman.validate.data({
  //   data,
  //   fieldChecks,
  // });

  // const { mode } = data;

  let settings = global.spiderman.db.system_settings.find();

  const modeNode = {
    db: {
      verified_maintain_duration: 5184000000, // 86400000 * 30 day
      non_verified_maintain_duration: 604800000, // 86400000 * 7 day
      maintain_disk_space_in_gb: 50, // 50GB
    },
  };
  modeNode.db.verified_maintain_duration = settings.db
    ? settings.db.verified_maintain_duration
    : 5184000000;

  modeNode.db.non_verified_maintain_duration = settings.db
    ? settings.db.non_verified_maintain_duration
    : 604800000;

  modeNode.db.maintain_disk_space_in_gb = settings.db
    ? settings.db.maintain_disk_space_in_gb
    : 50;

  settings = modeNode;

  return {
    message: 'ok',
    settings,
  };
};
