const fieldChecks = [
  {
    fieldName: 'license_server_address',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'license_server_port',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'license_key',
    fieldType: 'string',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const response = await global.spiderman.request.make({
    url: `http://${global.params.localhost}/system/addlicense`,
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
