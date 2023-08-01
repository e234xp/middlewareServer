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
    fieldName: 'with_image',
    fieldType: 'boolean',
    required: true,
  },
  {
    fieldName: 'uuid_list',
    fieldType: 'array',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });
  const uuidList = data.uuid_list.length > 0 ? data.uuid_list : null;
  const shift = data.slice_shift != null ? data.slice_shift : 0;
  const sliceLength = 10000;

  const resultList = global.domain.verifyresult
    .queryResults({
      collection: 'personverifyresult',
      startTime: data.start_time,
      endTime: data.end_time,
      query: {
        ...uuidList ? { uuid: { $in: uuidList } } : {},
      },
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
