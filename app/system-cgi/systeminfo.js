module.exports = async (data) => {
  await global.spiderman.request.make({
    url: `http://${global.spiderman.param.localhost}/system/info`,
    method: 'POST',
    pool: { maxSockets: 10 },
    time: true,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
    json: data,
  });

  return {
    message: 'ok',
  };
};
