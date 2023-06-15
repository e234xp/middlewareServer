const { uuid } = require('uuidv4');

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
    fieldName: 'as_admin',
    fieldType: 'boolean',
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
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  // 檢查是否超過
  const MAX_AMOUNT_OF_PERSON = 3;
  const people = global.spiderman.db.person.find();
  if (people.length >= MAX_AMOUNT_OF_PERSON) throw Error(`the numbers of persons in database has exceeded ${MAX_AMOUNT_OF_PERSON} (max).`);

  // 檢查 id 是否重複
  const existPerson = global.spiderman.db.person.findOne({
    id: data.id,
  });
  if (existPerson) throw Error('Id existed.');

  // 至少讓 group_list 有 All Person
  if (!data.group_list.includes('All Person')) {
    data.group_list.push('All Person');
  }

  if (data.register_image === '') {
    await insertData({ data });

    return {
      message: 'ok',
    };
  }

  // TODO 改為 global.engineGenerateFaceFeature
  const { faceImage, faceFeature, upperFaceFeature } = { faceImage: 'faceImage', faceFeature: 'faceFeature', upperFaceFeature: 'upperFaceFeature' };
  await insertData({
    data, faceImage, faceFeature, upperFaceFeature,
  });
  return {
    message: 'ok',
  };
};

async function insertData({
  data: { display_image: displayImage, register_image: _, ...otherData }, faceImage = '', faceFeature = '', upperFaceFeature = '',
}) {
  const now = Date.now();
  const dataToWrite = {
    uuid: uuid(),
    ...otherData,
    face_feature: faceFeature,
    upper_face_feature: upperFaceFeature,
    create_date: now,
    last_modify_date: now,
    last_modify_date_by_manager: now,
  };

  // TODO 改為 global.resizeImage
  // displayImage = (await global.resizeImage(displayImage)).base64_image;

  const registerImage = faceImage;
  global.domain.person.savePhoto({
    uuid: dataToWrite.uuid,
    displayImage,
    registerImage,
  });

  global.spiderman.db.person.insertOne(dataToWrite);
}
