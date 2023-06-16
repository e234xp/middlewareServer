const fieldChecks = [
  {
    fieldName: 'id',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'name',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'card_facility_code',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'card_number',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'group_list',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'begin_date',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'expire_date',
    fieldType: 'number',
    required: true,
  },
  {
    fieldName: 'extra_info',
    fieldType: 'object',
    required: true,
  },
  {
    fieldName: 'display_image',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'register_image',
    fieldType: 'string',
    required: true,
  },
];

module.exports = async (data) => {
  data = {
    ...global.spiderman.validate.data({
      data,
      fieldChecks,
    }),
    as_admin: false,
  };

  // 檢查是否超過
  const MAX_AMOUNT = 500;
  const visitors = global.spiderman.db.visitor.find();
  if (visitors.length >= MAX_AMOUNT) throw Error(`the numbers of persons in database has exceeded ${MAX_AMOUNT} (max).`);

  // 檢查 id 是否重複
  const existed = global.spiderman.db.visitor.findOne({
    id: data.id,
  });
  if (existed) throw Error('Id existed.');

  // 至少讓 group_list 有 All Person
  if (!data.group_list.includes('All Visitor')) {
    data.group_list.push('All Visitor');
  }

  if (!data.register_image) {
    await global.domain.visitor.insert({ data });

    return {
      message: 'ok',
    };
  }

  // TODO 等待傳入參數： 參考 engineGenerateFaceFeature
  const { faceImage, faceFeature, upperFaceFeature } = global.domain
    .facefeature.engineGenerate();
  await global.domain.visitor.insert({
    data, faceImage, faceFeature, upperFaceFeature,
  });

  return {
    message: 'ok',
  };
};
