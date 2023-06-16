module.exports = (data, token) => {
  const accounts = (() => {
    const accountsTmp = global.spiderman.db.account.find();
    const tokenUser = global.spiderman.token.decryptToAccount(token);

    return tokenUser.x === 'Admin'
      ? accountsTmp
      : accountsTmp.filter((d) => tokenUser.u === d.username);
  })();

  return {
    message: 'ok',
    account_list: accounts,
  };
};
