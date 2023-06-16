// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('request');

module.exports = () => {
  function make({ url, method }) {
    return new Promise((resolve, reject) => {
      request({
        url,
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  return { make };
};
