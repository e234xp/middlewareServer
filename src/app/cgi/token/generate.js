const fieldChecks = [
  {
    fieldName: 'username',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'password',
    fieldType: 'string',
    required: true,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const { username, password } = data;
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
