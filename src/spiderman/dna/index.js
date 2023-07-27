module.exports = {
  db: {
    workingFolder: global.params.dataPath,
    collections: [
      {
        name: 'account',
        type: 'file',
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
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'cameras',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'videodevicegroups',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'wiegandconverters',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'ioboxes',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'outputdevicegroups',
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
        cache: { isOpen: true },
      },
      {
        name: 'eventsettings',
        type: 'file',
        cache: { isOpen: false },
      },
      {
        name: 'dashboardsettings',
        type: 'file',
        cache: { isOpen: true },
      },
      {
        name: 'attendancesettings',
        type: 'file',
        cache: { isOpen: true },
      },
      {
        name: 'managersettings',
        type: 'file',
        cache: { isOpen: true },
      },
      {
        name: 'systemlog',
        type: 'record',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
      },
    ],
  },
};
