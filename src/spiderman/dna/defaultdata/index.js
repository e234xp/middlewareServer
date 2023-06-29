// 指定要列出檔案的資料夾路徑
module.exports = () => {
  const items = [
    'account.js',
    'attendancesettings.js',
    'dashboardsettings.js',
    'eventsettings.js',
    'groups.js',
    'managersettings.js',
    'settings.js',
  ];

  const defaultData = (() => {
    const tmp = {};

    items.forEach((item) => {
      const name = item.split('.')[0];
      tmp[name] = require(`./${item}`);
    });

    return tmp;
  })();

  return defaultData;
};
