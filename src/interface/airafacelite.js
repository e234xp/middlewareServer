module.exports = () => {
  const publicCgi = ['generatetoken', 'maintaintoken', 'test'];
  const router = {
    test: require('../app/cgi/test'),
    generatetoken: require('../app/cgi/token/generate'),
    maintaintoken: require('../app/cgi/token/maintain'),

    createaccount: require('../app/cgi/account/create'),
    findaccount: require('../app/cgi/account/find'),
    modifyaccount: require('../app/cgi/account/modify'),
    removeaccount: require('../app/cgi/account/remove'),
    resetadmin: require('../app/cgi/account/resetadmin'),

    createperson: require('../app/cgi/person/create'),
    findperson: require('../app/cgi/person/find'),
    modifyperson: require('../app/cgi/person/modify'),
    removeperson: require('../app/cgi/person/remove'),
    removeallpersons: require('../app/cgi/person/removeall'),
    fetchphoto: require('../app/cgi/person/fetchphoto'),

    createvisitor: require('../app/cgi/visitor/create'),
    findvisitor: require('../app/cgi/visitor/find'),
    modifyvisitor: require('../app/cgi/visitor/modify'),
    removevisitor: require('../app/cgi/visitor/remove'),
    removeallvisitors: require('../app/cgi/visitor/removeall'),

    creategroup: require('../app/cgi/group/create'),
    findgroup: require('../app/cgi/group/find'),
    modifygroup: require('../app/cgi/group/modify'),
    removegroup: require('../app/cgi/group/remove'),

    createcamera: require('../app/cgi/camera/create'),
    findcamera: require('../app/cgi/camera/find'),
    modifycamera: require('../app/cgi/camera/modify'),
    removecamera: require('../app/cgi/camera/remove'),

    createvideogroup: require('../app/cgi/videogroup/create'),
    findvideogroup: require('../app/cgi/videogroup/find'),
    modifyvideogroup: require('../app/cgi/videogroup/modify'),
    removevideogroup: require('../app/cgi/videogroup/remove'),

    createwiegandconverter: require('../app/cgi/wiegandconverter/create'),
    findwiegandconverter: require('../app/cgi/wiegandconverter/find'),
    modifywiegandconverter: require('../app/cgi/wiegandconverter/modify'),
    removewiegandconverter: require('../app/cgi/wiegandconverter/remove'),

    querypersonverifyresult: require('../app/cgi/verifyresult/queryperson'),
    queryvisitorverifyresult: require('../app/cgi/verifyresult/queryvisitor'),
    querystrangerverifyresult: require('../app/cgi/verifyresult/querystranger'),
    fetchverifyphoto: require('../app/cgi/verifyresult/fetchperson'),

    gettabletsettings: require('../app/cgi/tabletsettings/get'),
    settabletsettings: require('../app/cgi/tabletsettings/set'),

    geteventsettings: require('../app/cgi/eventsettings/get'),
    seteventsettings: require('../app/cgi/eventsettings/set'),

    getdashboardsettings: require('../app/cgi/dashboardsettings/get'),
    setdashboardsettings: require('../app/cgi/dashboardsettings/set'),

    getattendancesettings: require('../app/cgi/attendancesettings/get'),
    setattendancesettings: require('../app/cgi/attendancesettings/set'),

    getmanagersettings: require('../app/cgi/managersettings/get'),
    setmanagersettings: require('../app/cgi/managersettings/set'),

    querysystemlog: require('../app/cgi/systemlog/query'),
  };

  return {
    publicCgi,
    router,
  };
};
