module.exports = () => {
  function notify({ accesstoken, message }) {
    return global.spiderman.request.make({
      url: 'https://notify-api.line.me/api/notify',
      method: 'POST',
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        'Content-Type': 'multipart/form-data',
      },
      formData: {
        message,
      },
    });
  }

  return {
    notify,
  };
};
