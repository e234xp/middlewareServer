module.exports = () => {
  const publicCgi = ['checkin'];

  const router = {
    checkin: require('../../app/api/tablet/checkin'),
    verifyfaceservice: require('../../app/api/tablet/verifyfaceservice'),
    verifycardnoservice: require('../../app/api/tablet/verifycardnoservice'),
    getverifyresult: require('../../app/api/tablet/getverifyresult'),
  };

  return {
    publicCgi,
    router,
  };
};
