const { uuid } = require('uuidv4');

const fieldChecks = [
  {
    fieldName: 'username',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'password',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'permission',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'remarks',
    fieldType: 'string',
    required: true,
  },
];

module.exports = (data, token) => {
  // paramters checker
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const tokenUser = global.spiderman.token.decryptToAccount(token);
  const isPassed = tokenUser.u.length > 0
    && data.username.length > 0
    && data.password.length > 0
    && data.permission.length > 0;
  if (!isPassed) throw Error('Username or password cannot be empty.');

  const accounts = global.spiderman.db.account.find();

  const adminAccount = accounts.find((item) => (item.username === tokenUser.u) && (item.permission === 'Admin'));
  if (!adminAccount) throw Error('No permission.');

  const existededAccount = accounts.find((item) => (item.username === data.username));
  if (existededAccount) throw Error('The item has already existed.');

  // optional paramters set default value

  //  ===================================
  const {
    username, password, permission, remarks,
  } = data;

  const account = {
    uuid: uuid(),
    username,
    password,
    permission,
    remarks: remarks || '',
    fixed: false,
    create_date: Date.now(),
    last_modify_date: Date.now(),
  };

  global.spiderman.db.account.insertOne(account);

  return {
    message: 'ok',
  };
};
