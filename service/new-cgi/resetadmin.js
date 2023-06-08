module.exports = () => {
  const accounts = global.db.account.find();
  const adminAccount = accounts.find((a) => a.username === 'Admin');

  if (!adminAccount) {
    throw Error('account not founds');
  }

  adminAccount.last_modify_date = Date.now();
  adminAccount.password = '123456';
  global.db.account.set(accounts);

  return {
    message: 'ok',
  };
};
