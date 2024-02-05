module.exports = () => {
  async function notify({ accesstoken, message, image }) {
    const formData = (() => {
      const imageData = Buffer.from(image, 'base64');
      return {
        message,
        ...image ? {
          imageFile: {
            value: imageData,
            options: {
              filename: 'test.jpeg',
              contentType: 'image/jpeg',
            },
          },
        } : {},
      };
    })();

    const aaa = await global.spiderman.request.make({
      url: 'https://notify-api.line.me/api/notify',
      method: 'POST',
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        'Content-Type': 'multipart/form-data',
      },
      formData,
    });

    return aaa;
  }

  return {
    notify,
  };
};
