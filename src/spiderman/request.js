// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('request');

module.exports = () => {
  function make({
    url,
    method = 'POST',
    headers = { 'Content-Type': 'application/json' },
    ...others
  }) {
    return new Promise((resolve, reject) => {
      request({
        url,
        method,
        headers,
        ...others,
      }, (error, response, body) => {
        // console.log('error', error);
        // console.log('body', body);

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
