const { uuid } = require('uuidv4');

function requireDataOk(data) {
  if (data == null || data.username == null || data.password == null || data.permission == null) {
    return false;
  }
  return true;
}

module.exports = (data, token) => {
  if (!requireDataOk(data)) throw Error('invalid parameter.');

  const tokenUser = JSON.parse(global.decryptToeknToAccount(token));
  const isPassed = tokenUser.u.length > 0
  && data.username.length > 0
  && data.password.length > 0
  && data.permission.length > 0;
  if (!isPassed) throw Error('username or password cannot be empty.');

  const accounts = global.spiderman.db.account.find();

  const adminAccount = accounts.find((item) => (item.username === tokenUser.u) && (item.permission === 'Admin'));
  if (!adminAccount) throw Error('no permission');

  const existededAccount = accounts.find((item) => (item.username === data.username));
  if (existededAccount) throw Error('account has already existed');

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
