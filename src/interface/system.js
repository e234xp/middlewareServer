module.exports = () => {
  const publicCgi = ['test', 'systeminfo', 'downloadsyslog'];
  const router = {
    test: require('../app/system-cgi/test'),

    systeminfo: require('../app/system-cgi/systeminfo'),
    factorydefault: require('../app/system-cgi/factorydefault'),
    synctime: require('../app/system-cgi/synctime'),
    enablentp: require('../app/system-cgi/enablentp'),
    timeinfo: require('../app/system-cgi/timeinfo'),
    supportedlanguagelist: require('../app/system-cgi/supportedlanguagelist'),
    supportedtimezonelist: require('../app/system-cgi/supportedtimezonelist'),
    changewifi: require('../app/system-cgi/changewifi'),
    enableethernetdhcp: require('../app/system-cgi/enableethernetdhcp'),
    enableethernetstatic: require('../app/system-cgi/enableethernetstatic'),
    currentethernetinfo: require('../app/system-cgi/currentethernetinfo'),
    currentwifiinfo: require('../app/system-cgi/currentwifiinfo'),
    fetchwifilist: require('../app/system-cgi/fetchwifilist'),
    restart: require('../app/system-cgi/restart'),
    changelanguage: require('../app/system-cgi/changelanguage'),
    triggerrelay1: require('../app/system-cgi/triggerrelay1'),
    triggerrelay2: require('../app/system-cgi/triggerrelay2'),
    checkdbbackupfile: require('../app/system-cgi/checkdbbackupfile'),
    generatedbbackup: require('../app/system-cgi/generatedbbackup'),
    downloadsyslog: require('../app/system-cgi/downloadsyslog'),
    downloadcrashlog: require('../app/system-cgi/downloadcrashlog'),
    downloaddb: require('../app/system-cgi/downloaddb'),
    uploaddb: require('../app/system-cgi/uploaddb'),
    upgradefw: require('../app/system-cgi/upgradefw'),
  };

  return {
    publicCgi,
    router,
  };
};
