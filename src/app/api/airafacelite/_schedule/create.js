const recurrentFieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'type',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'times',
    fieldType: 'object',
    required: true,
  },
];

const nonRecurrentFieldChecks = [
  {
    fieldName: 'name',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'type',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'start_date',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'end_date',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'times',
    fieldType: 'array',
    required: true,
  },
];

module.exports = (data) => {
  const fieldChecks = (() => {
    if (data.type !== 'recurrent' && data.type !== 'non-recurrent') throw new Error('type must be recurrent or non-recurrent');

    if (data.type === 'recurrent') return recurrentFieldChecks;
    return nonRecurrentFieldChecks;
  })();

  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  global.domain.crud.insertOne({
    collection: 'schedules',
    data,
    uniqueKeys: ['name'],
  });

  return {
    message: 'ok',
  };
};
