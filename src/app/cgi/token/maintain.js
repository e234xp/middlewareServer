const fieldChecks = [
  {
    fieldName: 'token',
    fieldType: 'string',
    required: false,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const validAccountData = global.spiderman.token.decryptToAccountInTime(data.token);
  if (!validAccountData) throw Error('token has expired');

  const { u: username, p: password } = validAccountData;
  const account = global.spiderman.db.account.findOne({ username, password });

  if (!account) throw Error('unauthorized');

  return {
    message: 'ok',
    username: account.username,
    permission: account.permission,
    expire: Date.now(),
    token: global.spiderman.token.encryptFromAccount({
      u: account.username,
      p: account.password,
      t: Date.now(),
      x: account.permission,
    }),
  };
};
