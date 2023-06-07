module.exports = () => {
  const photo = global.models.person.fetchPhoto('8f217001-28af-4927-b44f-9f2f8b109ad0');

  return {
    message: 'ok',
    photo,
  };
};
