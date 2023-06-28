module.exports = () => {
  const cgiPath = '../app/cgi';
  const publicCgi = ['generatetoken', 'maintaintoken', 'test'];
  const router = {
    test: require(`${cgiPath}/test`),
    generatetoken: require(`${cgiPath}/token/generate`),
    maintaintoken: require(`${cgiPath}/token/maintain`),

    createaccount: require(`${cgiPath}/account/create`),
    findaccount: require(`${cgiPath}/account/find`),
    modifyaccount: require(`${cgiPath}/account/modify`),
    removeaccount: require(`${cgiPath}/account/remove`),
    resetadmin: require(`${cgiPath}/account/resetadmin`),

    createperson: require(`${cgiPath}/person/create`),
    findperson: require(`${cgiPath}/person/find`),
    modifyperson: require(`${cgiPath}/person/modify`),
    removeperson: require(`${cgiPath}/person/remove`),
    removeallpersons: require(`${cgiPath}/person/removeall`),
    fetchphoto: require(`${cgiPath}/person/fetchphoto`),

    createvisitor: require(`${cgiPath}/visitor/create`),
    findvisitor: require(`${cgiPath}/visitor/find`),
    modifyvisitor: require(`${cgiPath}/visitor/modify`),
    removevisitor: require(`${cgiPath}/visitor/remove`),
    removeallvisitors: require(`${cgiPath}/visitor/removeall`),

    creategroup: require(`${cgiPath}/group/create`),
    findgroup: require(`${cgiPath}/group/find`),
    modifygroup: require(`${cgiPath}/group/modify`),
    removegroup: require(`${cgiPath}/group/remove`),

    querypersonverifyresult: require(`${cgiPath}/verifyresult/queryperson`),
    queryvisitorverifyresult: require(`${cgiPath}/verifyresult/queryvisitor`),
    querystrangerverifyresult: require(`${cgiPath}/verifyresult/querystranger`),
    fetchverifyphoto: require(`${cgiPath}/verifyresult/fetchperson`),

    gettabletsettings: require(`${cgiPath}/tabletsettings/get`),
    settabletsettings: require(`${cgiPath}/tabletsettings/set`),

    geteventsettings: require(`${cgiPath}/eventsettings/get`),
    seteventsettings: require(`${cgiPath}/eventsettings/set`),

    getdashboardsettings: require(`${cgiPath}/dashboardsettings/get`),
    setdashboardsettings: require(`${cgiPath}/dashboardsettings/set`),

    getattendancesettings: require(`${cgiPath}/attendancesettings/get`),
    setattendancesettings: require(`${cgiPath}/attendancesettings/set`),

    getmanagersettings: require(`${cgiPath}/managersettings/get`),
    setmanagersettings: require(`${cgiPath}/managersettings/set`),

    querysystemlog: require(`${cgiPath}/systemlog/query`),
  };

  return {
    publicCgi,
    router,
  };
};
