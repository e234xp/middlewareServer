module.exports = () => {
  const publicCgi = ['generatetoken', 'maintaintoken', 'resetpassword'];
  const router = {
    // V
    // test: require('../../app/api/airafacelite/test'),
    generatetoken: require('../../app/api/airafacelite/token/generate'),
    maintaintoken: require('../../app/api/airafacelite/token/maintain'),

    // V
    createaccount: require('../../app/api/airafacelite/account/create'),
    findaccount: require('../../app/api/airafacelite/account/find'),
    modifyaccount: require('../../app/api/airafacelite/account/modify'),
    removeaccount: require('../../app/api/airafacelite/account/remove'),
    // resetadmin: require('../../app/api/airafacelite/account/resetadmin'),
    resetpassword: require('../../app/api/airafacelite/account/resetpassword'),

    // V
    createperson: require('../../app/api/airafacelite/person/create'),
    findperson: require('../../app/api/airafacelite/person/find'),
    modifyperson: require('../../app/api/airafacelite/person/modify'),
    removeperson: require('../../app/api/airafacelite/person/remove'),
    removeallpersons: require('../../app/api/airafacelite/person/removeall'),
    fetchphoto: require('../../app/api/airafacelite/person/fetchphoto'),

    // V
    createvisitor: require('../../app/api/airafacelite/visitor/create'),
    findvisitor: require('../../app/api/airafacelite/visitor/find'),
    modifyvisitor: require('../../app/api/airafacelite/visitor/modify'),
    removevisitor: require('../../app/api/airafacelite/visitor/remove'),
    removeallvisitors: require('../../app/api/airafacelite/visitor/removeall'),

    // V
    creategroup: require('../../app/api/airafacelite/group/create'),
    findgroup: require('../../app/api/airafacelite/group/find'),
    modifygroup: require('../../app/api/airafacelite/group/modify'),
    removegroup: require('../../app/api/airafacelite/group/remove'),

    // V
    createcamera: require('../../app/api/airafacelite/camera/create'),
    findcamera: require('../../app/api/airafacelite/camera/find'),
    modifycamera: require('../../app/api/airafacelite/camera/modify'),
    removecamera: require('../../app/api/airafacelite/camera/remove'),
    getcamerasnapshot: require('../../app/api/airafacelite/camerasnapshot/get'),

    // V
    createtablet: require('../../app/api/airafacelite/tablet/create'),
    findtablet: require('../../app/api/airafacelite/tablet/find'),
    modifytablet: require('../../app/api/airafacelite/tablet/modify'),
    removetablet: require('../../app/api/airafacelite/tablet/remove'),
    changeablet: require('../../app/api/airafacelite/tablet/change'),

    // V
    createvideodevicegroup: require('../../app/api/airafacelite/videodevicegroup/create'),
    findvideodevicegroup: require('../../app/api/airafacelite/videodevicegroup/find'),
    modifyvideodevicegroup: require('../../app/api/airafacelite/videodevicegroup/modify'),
    removevideodevicegroup: require('../../app/api/airafacelite/videodevicegroup/remove'),

    // V
    createwiegandconverter: require('../../app/api/airafacelite/wiegandconverter/create'),
    findwiegandconverter: require('../../app/api/airafacelite/wiegandconverter/find'),
    modifywiegandconverter: require('../../app/api/airafacelite/wiegandconverter/modify'),
    removewiegandconverter: require('../../app/api/airafacelite/wiegandconverter/remove'),

    // V
    createiobox: require('../../app/api/airafacelite/iobox/create'),
    findiobox: require('../../app/api/airafacelite/iobox/find'),
    modifyiobox: require('../../app/api/airafacelite/iobox/modify'),
    removeiobox: require('../../app/api/airafacelite/iobox/remove'),

    // V
    createoutputdevicegroup: require('../../app/api/airafacelite/outputdevicegroup/create'),
    findoutputdevicegroup: require('../../app/api/airafacelite/outputdevicegroup/find'),
    modifyoutputdevicegroup: require('../../app/api/airafacelite/outputdevicegroup/modify'),
    removeoutputdevicegroup: require('../../app/api/airafacelite/outputdevicegroup/remove'),

    // V
    querypersonverifyresult: require('../../app/api/airafacelite/verifyresult/queryperson'),
    queryvisitorverifyresult: require('../../app/api/airafacelite/verifyresult/queryvisitor'),
    querystrangerverifyresult: require('../../app/api/airafacelite/verifyresult/querystranger'),
    fetchverifyphoto: require('../../app/api/airafacelite/verifyresult/fetchperson'),
    addcommands: require('../../app/api/airafacelite/verifyresult/addcommands'),

    // V
    getdashboardsettings: require('../../app/api/airafacelite/dashboardsettings/get'),
    setdashboardsettings: require('../../app/api/airafacelite/dashboardsettings/set'),

    // V
    getsystemsettings: require('../../app/api/airafacelite/systemsettings/get'),
    setsystemsettings: require('../../app/api/airafacelite/systemsettings/set'),

    // V
    getattendancesettings: require('../../app/api/airafacelite/attendancesettings/get'),
    setattendancesettings: require('../../app/api/airafacelite/attendancesettings/set'),
    manualclockin: require('../../app/api/airafacelite/manualclockinresult/manualclockin'),
    querymanualclockinresult: require('../../app/api/airafacelite/manualclockinresult/query'),

    // V
    getmanagersettings: require('../../app/api/airafacelite/managersettings/get'),
    setmanagersettings: require('../../app/api/airafacelite/managersettings/set'),

    // V
    querysystemlog: require('../../app/api/airafacelite/systemlog/query'),

    // V
    addlicense: require('../../app/api/airafacelite/license/add'),
    findlicense: require('../../app/api/airafacelite/license/find'),
    removelicense: require('../../app/api/airafacelite/license/remove'),
    defaultlicense: require('../../app/api/airafacelite/license/default'),

    // V
    findeventhandle: require('../../app/api/airafacelite/eventhandle/find'),
    createeventhandle: require('../../app/api/airafacelite/eventhandle/create'),
    modifyeventhandle: require('../../app/api/airafacelite/eventhandle/modify'),
    removeeventhandle: require('../../app/api/airafacelite/eventhandle/remove'),

    // X
    // gettabletsettings: require('../../app/api/airafacelite/tabletsettings/get'),
    // settabletsettings: require('../../app/api/airafacelite/tabletsettings/set'),

    // X
    // geteventsettings: require('../../app/api/airafacelite/eventsettings/get'),
    // seteventsettings: require('../../app/api/airafacelite/eventsettings/set'),

    // X
    // ==========================================================
    // createrule: require('../../app/api/airafacelite/rule/create'),
    // findrule: require('../../app/api/airafacelite/rule/find'),
    // modifyrule: require('../../app/api/airafacelite/rule/modify'),
    // removerule: require('../../app/api/airafacelite/rule/remove'),

    // createschedule: require('../../app/api/airafacelite/schedule/create'),
    // findschedule: require('../../app/api/airafacelite/schedule/find'),
    // modifyschedule: require('../../app/api/airafacelite/schedule/modify'),
    // removeschedule: require('../../app/api/airafacelite/schedule/remove'),

    // createlinecommand: require('../../app/api/airafacelite/linecommand/create'),
    // findlinecommand: require('../../app/api/airafacelite/linecommand/find'),
    // modifylinecommand: require('../../app/api/airafacelite/linecommand/modify'),
    // removelinecommand: require('../../app/api/airafacelite/linecommand/remove'),

    // createemailcommand: require('../../app/api/airafacelite/emailcommand/create'),
    // findemailcommand: require('../../app/api/airafacelite/emailcommand/find'),
    // modifyemailcommand: require('../../app/api/airafacelite/emailcommand/modify'),
    // removeemailcommand: require('../../app/api/airafacelite/emailcommand/remove'),

    // createhttpcommand: require('../../app/api/airafacelite/httpcommand/create'),
    // findhttpcommand: require('../../app/api/airafacelite/httpcommand/find'),
    // modifyhttpcommand: require('../../app/api/airafacelite/httpcommand/modify'),
    // removehttpcommand: require('../../app/api/airafacelite/httpcommand/remove'),
    // ==========================================================
  };

  return {
    publicCgi,
    router,
  };
};
