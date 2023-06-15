const fieldChecks = [
  {
    fieldName: 'account_uuid_list',
    fieldType: 'array',
    required: true,
  },
];

module.exports = (data, token) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const tokenUser = global.spiderman.token.decryptToAccount(token);
  if (!tokenUser.u || data.account_uuid_list.length === 0) {
    throw new Error('list cannot be empty');
  }

  const accounts = global.spiderman.db.account.find();

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

  global.spiderman.db.account.set(newAccountList);

  return {
    message: 'ok',
  };
};
