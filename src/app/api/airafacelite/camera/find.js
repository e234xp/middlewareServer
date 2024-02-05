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
];

module.exports = async (data) => {
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
      query: { ...(!uuid ? {} : { uuid }) },
      sliceShift,
      sliceLength,
    });

  const status = await global.domain.camera.status();
  result.forEach((e) => {
    const r = status.filter((s) => (s.uuid === e.uuid));
    if (r.length > 0) {
      e.alive = r[0].alive;
    } else e.alive = false;
  });

  return {
    message: 'ok',
    total_length: totalLength,
    slice_shift: sliceShift,
    slice_length: sliceLength,
    list: result,
  };
};
