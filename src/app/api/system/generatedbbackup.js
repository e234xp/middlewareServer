module.exports = async (data) => {
  const response = await global.spiderman.request.make({
    url: `http://${global.params.localhost}/system/zipdb`,
    method: 'POST',
    pool: { maxSockets: 10 },
    time: true,
    timeout: 600000,
    headers: {
      'Content-Type': 'application/json',
    },
    json: data,
  });

  return response;
};
