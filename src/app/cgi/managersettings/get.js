module.exports = () => {
  const settings = global.spiderman.db.managersettings.findOne({});
  const { manager_token_key: _, ...others } = settings;

  return {
    message: 'ok',
    settings: others,
  };
};
