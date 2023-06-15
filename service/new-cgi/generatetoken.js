function requireDataOk(data) {
  if (data == null || data.username == null || data.password == null) {
    return false;
  }
  return true;
}

module.exports = (data) => {
  if (!requireDataOk(data)) throw Error('invalid parameter.');

  const { username, password } = data;
  const account = global.spiderman.db.account.findOne({ username, password });

  if (!account) throw Error('unauthorized');

  return {
    message: 'ok',
    username: account.username,
    permission: account.permission,
    expire: Date.now(),
    token: global.encryptAccountToToken(JSON.stringify({
      u: account.username,
      p: account.password,
      t: Date.now(),
      x: account.permission,
    })),
  };
};
