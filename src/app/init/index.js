module.exports = () => {
  global.domain.workerIobox.init();
  global.domain.workerWiegand.init();
  global.domain.workerResult.init();
};
