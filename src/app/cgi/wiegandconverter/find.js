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

  const { uuid, slice_shift: shift, slice_length: sliceLength } = data;

  const list = global.domain.crud
    .find({
      collection: 'wiegandconverters', query: { ...(uuid === '' ? {} : { uuid }) }, shift, sliceLength,
    });

  return {
    message: 'ok',
    total_length: list.length,
    slice_shift: shift,
    slice_length: sliceLength,
    camera_list: list,
  };
};
