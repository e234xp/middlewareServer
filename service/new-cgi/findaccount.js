function requireDataOk(data) {
  if (data == null) {
    return false;
  }
  return true;
}

module.exports = (data, token) => {
  if (!requireDataOk(data)) throw Error('invalid parameter.');

  const accounts = (() => {
    const accountsTmp = global.db.account.find();
    const tokenUser = JSON.parse(global.decryptToeknToAccount(token));

    return tokenUser.x === 'Admin'
      ? accountsTmp
      : accountsTmp.filter((d) => tokenUser.u === d.username);
  })();

  return {
    message: 'ok',
    account_list: accounts,
  };
};
