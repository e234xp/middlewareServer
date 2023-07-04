const defaultdata = require('./defaultdata')();

module.exports = {
  db: {
    workingFolder: global.params.dataPath,
    collections: [
      {
        name: 'account',
        type: 'file',
        defaultData: defaultdata.account,
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'person',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'visitor',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'groups',
        type: 'file',
        defaultData: defaultdata.groups,
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'cameras',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'wiegandconverters',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'personverifyresult',
        type: 'record',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
      },
      {
        name: 'personverifyresultphoto',
        type: 'image',
      },
      {
        name: 'visitorverifyresult',
        type: 'record',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
      },
      {
        name: 'visitorverifyresultphoto',
        type: 'image',
      },
      {
        name: 'nonverifyresult',
        type: 'record',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
      },
      {
        name: 'nonverifyresultphoto',
        type: 'image',
      },
      {
        name: 'photo',
        type: 'image',
      },
      {
        name: 'settings',
        type: 'file',
        defaultData: defaultdata.settings,
        cache: { isOpen: true },
      },
      {
        name: 'eventsettings',
        type: 'file',
        defaultData: defaultdata.eventsettings,
        cache: { isOpen: false },
      },
      {
        name: 'dashboardsettings',
        defaultData: defaultdata.dashboardsettings,
        type: 'file',
        cache: { isOpen: true },
      },
      {
        name: 'attendancesettings',
        defaultData: defaultdata.attendancesettings,
        type: 'file',
        cache: { isOpen: true },
      },
      {
        name: 'managersettings',
        defaultData: defaultdata.managersettings,
        type: 'file',
        cache: { isOpen: true },
      },
      {
        name: 'systemlog',
        defaultData: defaultdata.attendancesettings,
        type: 'record',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
      },
    ],
  },
};
