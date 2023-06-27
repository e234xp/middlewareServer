module.exports = async () => {
  const response = await global.spiderman.request.make({
    url: `http://${global.spiderman.param.localhost}/system/generatesyslog`,
    method: 'POST',
    pool: { maxSockets: 10 },
    time: true,
    timeout: 600000,
    headers: {
      'Content-Type': 'application/json',
    },
    json: {},
  });

  return response;
};
