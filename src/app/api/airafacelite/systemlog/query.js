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
    required: false,
  },
  {
    fieldName: 'slice_length',
    fieldType: 'number',
    required: false,
  },
  {
    fieldName: 'level_list',
    fieldType: 'array',
    required: false,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  if (!data.slice_shift) data.slice_shift = 0;
  if (!data.slice_length) data.slice_length = 100;

  const resultList = global.spiderman.db.systemlog
    .find({
      startTime: data.start_time,
      endTime: data.end_time,
      query: {
        log_level: { $in: data.level_list },
      },
    })
    .map(({ face_image_id: _, ...others }) => ({ ...others }));

  return {
    message: 'ok',
    result: {
      total_length: resultList ? resultList.length : 0,
      slice_shift: data.slice_shift,
      slice_length: data.slice_length,
      data: resultList
        ? resultList.slice(data.slice_shift, data.slice_shift + data.slice_length)
        : [],
    },
  };
};
