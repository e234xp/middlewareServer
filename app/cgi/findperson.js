const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'slice_shift',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'slice_length',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'download_register_image',
    fieldType: 'boolean',
    required: true,
  },
  {
    fieldName: 'download_display_image',
    fieldType: 'boolean',
    required: true,
  },
  {
    fieldName: 'download_face_feature',
    fieldType: 'boolean',
    required: true,
  },
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const shift = data.slice_shift ? data.slice_shift : 0;
  const sliceLength = data.slice_length ? data.slice_length : 100;
  const { uuid } = data;

  const personList = global.domain.person
    .find({
      query: { ...(uuid === '' ? {} : { uuid }) }, shift, sliceLength, data,
    });

  return {
    message: 'ok',
    total_length: personList.length,
    slice_shift: shift,
    slice_length: sliceLength,
    person_list: personList,
  };
};
