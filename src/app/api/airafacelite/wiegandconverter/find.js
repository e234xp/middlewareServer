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

  const { uuid, slice_shift: sliceShift, slice_length: sliceLength } = data;

  const { totalLength, result } = global.domain.crud
    .find({
      collection: 'wiegandconverters',
      query: { ...(uuid === '' ? {} : { uuid }) },
      sliceShift,
      sliceLength,
    });

  return {
    message: 'ok',
    total_length: totalLength,
    slice_shift: sliceShift,
    slice_length: sliceLength,
    list: result,
  };
};
