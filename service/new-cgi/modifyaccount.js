function requireDataOk(data) {
  if (!data || !data.username || !data.new_password) {
    return false;
  }
  return true;
}

module.exports = (data, token) => {
  if (!requireDataOk(data)) throw Error('invalid parameter.');

  const tokenUser = JSON.parse(global.decryptToeknToAccount(token));

  // 檢查使用者名稱和新密碼是否為空
  if (!tokenUser.u || !data.username || !data.new_password) {
    throw Error('username or password cannot be empty.');
  }

  // 檢查權限
  if (data.username === 'Admin' && tokenUser.u !== 'Admin') {
    throw Error('no permission');
  }

  const accounts = global.db.account.find();

  // 檢查是否為使用Admin權限
  const isAdmin = accounts.some((a) => a.username === tokenUser.u && a.permission === 'Admin');

  // 尋找要修改的帳號
  const account = accounts.find((a) => a.username === data.username);
  if (!account) {
    throw Error('account not found.');
  }

  // 檢查是否有修改帳號的權限
  const canModifyAccount = isAdmin || tokenUser.u === account.username;
  if (!canModifyAccount) {
    throw Error('no permission');
  }

  // 更新帳號資料
  const set = {
    last_modify_date: Date.now(),
    password: data.new_password,
    ...data.new_permission ? { permission: data.new_permission } : {},
  };

  global.db.account.updateOne({ username: account.username }, set);

  return {
    message: 'ok',
  };
};
