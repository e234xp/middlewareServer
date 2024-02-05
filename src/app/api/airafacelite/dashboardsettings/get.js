const fieldChecks = [
  {
    fieldName: 'mode', // SELFCHECKIN, WELCOME, OCCUPANCY, CAPACITY
    fieldType: 'string',
    required: false,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const { mode } = data;

  let settings = global.spiderman.db.dashboardsettings.findOne({});

  if (mode) {
    const modeNode = {};
    modeNode[mode] = settings[mode];
    settings = modeNode;
  }

  return {
    message: 'ok',
    settings,
  };
};
