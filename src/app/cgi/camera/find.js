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

  const sliceShift = data.slice_shift ? data.slice_shift : 0;
  const sliceLength = data.slice_length ? data.slice_length : 100;
  const { uuid } = data;

  const { totalLength, result } = global.domain.crud
    .find({
      collection: 'cameras',
      query: { ...(uuid === '' ? {} : { uuid }) },
      sliceShift,
      sliceLength,
    });

  // todo total_length
  return {
    message: 'ok',
    total_length: totalLength,
    slice_shift: sliceShift,
    slice_length: sliceLength,
    camera_list: result,
  };
};
