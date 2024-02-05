const fieldChecks = [
  {
    fieldName: 'license_key',
    fieldType: 'string',
    required: true,
  }
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const response = await global.spiderman.request.make({
    url: `http://${global.params.localhost}/system/removelicense`,
    method: 'POST',
    pool: { maxSockets: 10 },
    time: true,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
    json: data,
  });

  return response;
};
