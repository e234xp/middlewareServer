const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'slice_shift',
    fieldType: 'number',
    required: false,
  },
  {
    fieldName: 'slice_length',
    fieldType: 'number',
    required: false,
  },
  {
    fieldName: 'download_register_image',
    fieldType: 'boolean',
    required: false,
  },
  {
    fieldName: 'download_display_image',
    fieldType: 'boolean',
    required: false,
  },
  {
    fieldName: 'download_face_feature',
    fieldType: 'boolean',
    required: false,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  data.slice_shift = data.slice_shift ? data.slice_shift : 0;
  data.slice_length = data.slice_length ? data.slice_length : 100;
  data.download_register_image = data.download_register_image
    ? data.download_register_image : false;
  data.download_display_image = data.download_display_image
    ? data.download_display_image : false;
  data.download_face_feature = data.download_face_feature
    ? data.download_face_feature : false;

  const { uuid } = data;

  const personList = global.domain.person
    .find({
      query: { ...(!uuid ? {} : { uuid }) },
      shift: data.slice_shift,
      sliceLength: data.slice_length,
      data,
    });

  return {
    message: 'ok',
    total_length: personList.length,
    slice_shift: data.slice_shift,
    slice_length: data.slice_length,
    person_list: personList,
  };
};
