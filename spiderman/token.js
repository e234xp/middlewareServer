const TOKEN_KEY = 'aira83522758';
module.exports = () => {
  function encryptFromAccount(account) {
    const string = JSON.stringify(account);
    const textToChars = (tmp) => tmp.split('').map((c) => c.charCodeAt(0));
    const byteHex = (n) => (`0${Number(n).toString(16)}`).substr(-2);
    // eslint-disable-next-line no-bitwise
    const applySaltToChar = (code) => textToChars(TOKEN_KEY).reduce((a, b) => a ^ b, code);

    return string
      .split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  }

  function decryptToAccount(encoded) {
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    // eslint-disable-next-line no-bitwise
    const applySaltToChar = (code) => textToChars(TOKEN_KEY).reduce((a, b) => a ^ b, code);

    const string = encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join('');

    return JSON.parse(string);
  }

  function decryptToAccountInTime(token) {
    const accountData = decryptToAccount(token);

    if ((accountData.t + 300000) <= Date.now()) return null;
    return accountData;
  }

  return {
    encryptFromAccount,
    decryptToAccount,
    decryptToAccountInTime,
  };
};
