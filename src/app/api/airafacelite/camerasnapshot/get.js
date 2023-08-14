const fieldChecks = [
  {
    fieldName: 'url',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'uuid',
    fieldType: 'nonempty',
    required: true,
  },

];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const { url, uuid } = data;
  const base64 = await global.domain.cameraSnapShot.get({ url, uuid });

  return {
    message: 'ok',
    base64,
  };
};
