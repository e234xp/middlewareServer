module.exports = {
  db: {
    workingFolder: '/Users/liaoguanjie/城智/middlewareServer/database',
    collections: [
      {
        name: 'account',
        type: 'file',
        defaultData: [{
          uuid: '0',
          username: 'Admin',
          password: '123456',
          permission: 'Admin',
          fixed: true,
          remarks: '',
          create_date: 1628380800000,
          last_modify_date: 1628380800000,
        }],
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'person',
        type: 'file',
        cache: { isOpen: false },
      },
      {
        name: 'personverifyresult',
        type: 'record',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
      },
      {
        name: 'photo',
        type: 'image',
      },
    ],
  },

};
