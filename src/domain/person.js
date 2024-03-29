const { uuid: uuidv4 } = require('uuidv4');

module.exports = (collection = global.spiderman.db.person) => {
  function find({
    query, shift, sliceLength, data,
  }) {
    const result = collection
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

    displayImage = await global.spiderman.image.resize(displayImage);

    const registerImage = faceImage;
    savePhoto({
      uuid: dataToWrite.uuid,
      displayImage,
      registerImage,
    });

    collection.insertOne(dataToWrite);
  }

  async function modify({
    uuid, data: { display_image: displayImage, register_image: _, ...otherData }, faceImage = '', faceFeature = '', upperFaceFeature = '',
  }) {
    const now = Date.now();
    const dataToWrite = {
      ...otherData,
      face_feature: faceFeature,
      upper_face_feature: upperFaceFeature,
      last_modify_date: now,
      last_modify_date_by_manager: now,
    };

    displayImage = await global.spiderman.image.resize(displayImage);

    const registerImage = faceImage;
    savePhoto({
      uuid,
      displayImage,
      registerImage,
    });

    collection.updateOne({ uuid }, dataToWrite);
  }

  function remove({ uuid }) {
    collection.deleteMany({ uuid: { $in: uuid } });
    removePhoto(uuid);
  }

  function removeAll() {
    const items = collection.deleteMany({});
    const uuids = items.map(({ uuid }) => uuid);
    removePhoto(uuids);
  }

  function savePhoto({ uuid, displayImage, registerImage }) {
    global.spiderman.db.dbPhoto.insertOne(`${uuid}.display`, displayImage);
    global.spiderman.db.dbPhoto.insertOne(`${uuid}.register`, registerImage);
  }

  function removePhoto(uuid) {
    const fileNames = uuid
      .map((item) => ([`${item}.display`, `${item}.register`]))
      .flat();

    global.spiderman.db.dbPhoto.deleteMany(fileNames);
  }

  function fetchPhoto(uuid) {
    const isFetch = uuid && uuid.length > 0;

    return isFetch
      ? {
        display_image: global.spiderman.db.dbPhoto.findOne(`${uuid}.display`),
        register_image: global.spiderman.db.dbPhoto.findOne(`${uuid}.register`),
      }
      : {
        display_image: '',
        register_image: '',
      };
  }

  return {
    find,
    insert,
    modify,
    remove,
    removeAll,
    fetchPhoto,
  };
};
