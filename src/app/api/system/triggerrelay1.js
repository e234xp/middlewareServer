module.exports = async () => {
  const response = await global.spiderman.request.make({
    url: `http://${global.params.localhost}/system/tr1`,
    method: 'POST',
    pool: { maxSockets: 10 },
    time: true,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
    json: {},
  });

  return response;
};
