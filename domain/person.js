const { uuid: uuidv4 } = require('uuidv4');

module.exports = () => {
  function find({
    query, shift, sliceLength, data,
  }) {
    const result = global.spiderman.db.person
      .find(query)
      .slice(shift, shift + sliceLength)
      .map((item) => {
        delete item.___id;
        delete item.___s;
        if (!data.download_face_feature) delete item.face_feature;
        if (data.download_register_image || data.download_display_image) {
          const photo = fetchPhoto(item.uuid);
          if (data.download_register_image) item.register_image = photo.register_image;
          if (data.download_display_image) item.display_image = photo.display_image;
        }

        return item;
      });

    return result;
  }

  async function insert({
    data: { display_image: displayImage, register_image: _, ...otherData }, faceImage = '', faceFeature = '', upperFaceFeature = '',
  }) {
    const now = Date.now();
    const dataToWrite = {
      uuid: uuidv4(),
      ...otherData,
      face_feature: faceFeature,
      upper_face_feature: upperFaceFeature,
      create_date: now,
      last_modify_date: now,
      last_modify_date_by_manager: now,
    };

    displayImage = await resizeImage(displayImage);

    const registerImage = faceImage;
    savePhoto({
      uuid: dataToWrite.uuid,
      displayImage,
      registerImage,
    });

    global.spiderman.db.person.insertOne(dataToWrite);
  }

  async function modify({
    uuid, data: { display_image: displayImage, register_image: _, ...otherData }, faceImage = '', faceFeature = '', upperFaceFeature = '',
  }) {
    const now = Date.now();
    const dataToWrite = {
      ...otherData,
      face_feature: faceFeature,
      upper_face_feature: upperFaceFeature,
      create_date: now,
      last_modify_date: now,
      last_modify_date_by_manager: now,
    };

    displayImage = await resizeImage(displayImage);

    const registerImage = faceImage;
    savePhoto({
      uuid,
      displayImage,
      registerImage,
    });

    global.spiderman.db.person.updateOne({ uuid }, dataToWrite);
  }

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

  // TODO 改為 global.resizeImage
  function resizeImage(base64Image) {
    return base64Image || '';
  }

  return {
    find,
    insert,
    modify,
    fetchPhoto,
  };
};
