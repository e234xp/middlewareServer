module.exports = () => {
  const cgiPath = '../app/system-cgi';
  const publicCgi = ['test', 'systeminfo', 'downloadsyslog'];
  const router = {
    test: require(`${cgiPath}/test`),

    systeminfo: require(`${cgiPath}/systeminfo`),
    factorydefault: require(`${cgiPath}/factorydefault`),
    synctime: require(`${cgiPath}/synctime`),
    enablentp: require(`${cgiPath}/enablentp`),
    timeinfo: require(`${cgiPath}/timeinfo`),
    supportedlanguagelist: require(`${cgiPath}/supportedlanguagelist`),
    supportedtimezonelist: require(`${cgiPath}/supportedtimezonelist`),
    changewifi: require(`${cgiPath}/changewifi`),
    enableethernetdhcp: require(`${cgiPath}/enableethernetdhcp`),
    enableethernetstatic: require(`${cgiPath}/enableethernetstatic`),
    currentethernetinfo: require(`${cgiPath}/currentethernetinfo`),
    currentwifiinfo: require(`${cgiPath}/currentwifiinfo`),
    fetchwifilist: require(`${cgiPath}/fetchwifilist`),
    restart: require(`${cgiPath}/restart`),
    changelanguage: require(`${cgiPath}/changelanguage`),
    triggerrelay1: require(`${cgiPath}/triggerrelay1`),
    triggerrelay2: require(`${cgiPath}/triggerrelay2`),
    checkdbbackupfile: require(`${cgiPath}/checkdbbackupfile`),
    generatedbbackup: require(`${cgiPath}/generatedbbackup`),
    downloadsyslog: require(`${cgiPath}/downloadsyslog`),
    downloadcrashlog: require(`${cgiPath}/downloadcrashlog`),
    downloaddb: require(`${cgiPath}/downloaddb`),
    uploaddb: require(`${cgiPath}/uploaddb`),
    upgradefw: require(`${cgiPath}/upgradefw`),
  };

  return {
    publicCgi,
    router,
  };
};
