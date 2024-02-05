const fieldChecks = [
];

module.exports = (data, token) => {
  // paramters checker
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  // optional paramters set default value

  //  ===================================
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
