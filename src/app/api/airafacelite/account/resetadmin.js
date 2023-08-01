module.exports = () => {
  const accounts = global.spiderman.db.account.find();
  const adminAccount = accounts.find((a) => a.username === 'Admin');

  if (!adminAccount) {
    throw Error('Item not found.');
  }

  adminAccount.last_modify_date = Date.now();
  adminAccount.password = '123456';
  global.spiderman.db.account.set(accounts);

  return {
    message: 'ok',
  };
};
