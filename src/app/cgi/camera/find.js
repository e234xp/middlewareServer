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
];

module.exports = (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const shift = data.slice_shift ? data.slice_shift : 0;
  const sliceLength = data.slice_length ? data.slice_length : 100;
  const { uuid } = data;

  const list = global.domain.camera
    .find({
      query: { ...(uuid === '' ? {} : { uuid }) }, shift, sliceLength,
    });

  return {
    message: 'ok',
    total_length: list.length,
    slice_shift: shift,
    slice_length: sliceLength,
    camera_list: list,
  };
};
