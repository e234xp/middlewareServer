const fieldChecks = [
  {
    fieldName: 'start_time',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'end_time',
    fieldType: 'number',
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
    required: false,
  },
  {
    fieldName: 'with_image',
    fieldType: 'boolean',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });
  const shift = data.slice_shift != null ? data.slice_shift : 0;
  const sliceLength = data.slice_length || 100;

  const resultList = global.domain.verifyresult
    .queryResults({
      collection: 'nonverifyresult',
      startTime: data.start_time,
      endTime: data.end_time,
    });

  return {
    message: 'ok',
    result: {
      total_length: resultList ? resultList.length : 0,
      slice_shift: shift,
      slice_length: sliceLength,
      data: resultList ? resultList.slice(shift, shift + sliceLength) : [],
    },
  };
};
