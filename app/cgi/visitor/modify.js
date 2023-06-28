const fieldChecks = [
  {
    fieldName: 'uuid',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'data',
    fieldType: 'object',
    required: true,
  },
];

const fieldChecksData = [
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
    fieldName: 'card_number',
    fieldType: 'string',
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
    fieldName: 'group_list',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'card_facility_code',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'as_admin',
    fieldType: 'boolean',
    required: true,
  },
  {
    fieldName: 'extra_info',
    fieldType: 'object',
    required: true,
  },
];

module.exports = async (rData) => {
  const { uuid } = global.spiderman.validate.data({
    data: rData,
    fieldChecks,
  });

  const data = global.spiderman.validate.data({
    data: rData.data,
    fieldChecks: fieldChecksData,
  });

  if (!data.register_image) {
    await global.domain.visitor.modify({ uuid, data });

    return {
      message: 'ok',
    };
  }

  const {
    face_image: faceImage = '',
    face_feature: faceFeature = '',
    upper_face_feature: upperFaceFeature = '',
  } = await global.spiderman.facefeature.engineGenerate(data.register_image);

  await global.domain.visitor.modify({
    uuid, data, faceImage, faceFeature, upperFaceFeature,
  });

  return {
    message: 'ok',
  };
};
