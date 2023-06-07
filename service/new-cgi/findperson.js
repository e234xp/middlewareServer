function requireDataOk(data) {
  if (data == null || data.uuid == null) {
    return false;
  }
  return true;
}

module.exports = (data) => {
  if (!requireDataOk(data)) throw Error('invalid parameter.');

  const shift = data.slice_shift ? data.slice_shift : 0;
  const sliceLength = data.slice_length ? data.slice_length : 100;
  const { uuid } = data;
  const personList = global.db.person
    .find({ ...(uuid === '' ? {} : { uuid }) })
    .slice(shift, shift + sliceLength)
    .map((item) => {
      delete item.___id;
      delete item.___s;
      if (!data.download_face_feature) delete item.face_feature;
      if (data.download_register_image || data.download_display_image) {
        const photo = global.models.person.fetchPhoto(item.uuid);
        if (data.download_register_image) item.register_image = photo.register_image;
        if (data.download_display_image) item.display_image = photo.display_image;
      }

      return item;
    });

  return {
    message: 'ok',
    total_length: personList.length,
    slice_shift: shift,
    slice_length: sliceLength,
    person_list: personList,
  };
};
