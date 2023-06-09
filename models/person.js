module.exports = () => {
  function savePhoto({ uuid, displayImage, registerImage }) {
    global.db.photo.imageInsertOne(`${uuid}.display`, displayImage);
    global.db.photo.imageInsertOne(`${uuid}.register`, registerImage);
  }

  function fetchPhoto(uuid) {
    const isFetch = uuid && uuid.length > 0;

    return isFetch
      ? {
        display_image: global.db.photo.imageFindOne(`${uuid}.display`),
        register_image: global.db.photo.imageFindOne(`${uuid}.register`),
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
