const { uuid: uuidv4 } = require('uuidv4');

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
          create_date: Date.now(),
          last_modify_date: Date.now(),
        }],
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
        defaultData: [
          {
            uuid: uuidv4(),
            name: 'All Person',
            remarks: '',
            fixed: true,
            no_edit: true,
            create_date: Date.now(),
          },
          {
            uuid: uuidv4(),
            name: 'All Visitor',
            remarks: '',
            fixed: true,
            no_edit: true,
            create_date: Date.now(),
          },
        ],
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
    ],
  },

};
