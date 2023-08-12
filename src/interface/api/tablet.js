module.exports = () => {
  const publicCgi = ['checkin'];

  const router = {
    checkin: require('../../app/api/tablet/checkin'),
  };

  return {
    publicCgi,
    router,
  };
};
