function requireDataOk(data) {
  if (data == null || data.account_uuid_list == null) {
    return false;
  }
  return true;
}

module.exports = (data, token) => {
  if (!requireDataOk(data)) throw Error('invalid parameter.');

  const tokenUser = JSON.parse(global.decryptToeknToAccount(token));
  if (!tokenUser.u || data.account_uuid_list.length === 0) {
    throw new Error('list cannot be empty');
  }

  const accounts = global.db.account.find();

  // 檢查是否為使用Admin權限
  const isAdmin = accounts.some((a) => a.username === tokenUser.u && a.permission === 'Admin');
  if (!isAdmin) {
    throw Error('no permission');
  }

  const newAccountList = accounts.filter((item) => {
    const isDeleting = data.account_uuid_list.includes(item.uuid);
    return !isDeleting || item.fixed;
  });

  if (newAccountList.length === accounts.length) {
    throw Error('account not found');
  }

  global.db.account.set(newAccountList);

  return {
    message: 'ok',
  };
};
