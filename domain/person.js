module.exports = () => {
  function savePhoto({ uuid, displayImage, registerImage }) {
    global.spiderman.db.photo.insertOne(`${uuid}.display`, displayImage);
    global.spiderman.db.photo.insertOne(`${uuid}.register`, registerImage);
  }

  function fetchPhoto(uuid) {
    const isFetch = uuid && uuid.length > 0;

    return isFetch
      ? {
        display_image: global.spiderman.db.photo.findOne(`${uuid}.display`),
        register_image: global.spiderman.db.photo.findOne(`${uuid}.register`),
      }
      : {
        display_image: '',
        register_image: '',
      };
  }

  return {
    savePhoto,
    fetchPhoto,
  };
};
