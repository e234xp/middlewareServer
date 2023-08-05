const { uuid: uuidv4 } = require('uuidv4');

module.exports = () => {
  function find({
    collection, query, sliceShift, sliceLength,
  }) {
    const allData = global.spiderman.db[collection]
      .find(query);

    const totalLength = allData.length;

    const result = allData
      .slice(sliceShift, sliceShift + sliceLength);

    return { totalLength, result };
  }

  function insertOne({ collection, data, uniqueKeys = null }) {
    if (uniqueKeys) {
      const uniqueObject = uniqueKeys
        .map((key) => [key, data[key]])
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      const doesExist = global.spiderman.db[collection]
        .findOne(uniqueObject);

      if (doesExist) throw Error('duplicate data found');
    }

    const now = Date.now();

    const dataToWrite = {
      uuid: uuidv4(),
      ...data,
      created_time: now,
      updated_time: now,
    };

    global.spiderman.db[collection].insertOne(dataToWrite);

    return dataToWrite;
  }

  function insertMany({ collection, data }) {
    const now = Date.now();

    data = data.map((item) => ({
      uuid: uuidv4(),
      ...item,
      created_time: now,
      updated_time: now,
    }));

    global.spiderman.db[collection].insertMany(data);
  }

  function modify({
    collection, uuid, data, uniqueKeys = null,
  }) {
    if (uniqueKeys) {
      const uniqueObject = uniqueKeys
        .map((key) => [key, data[key]])
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      const doesExist = global.spiderman.db[collection]
        .findOne({ ...uniqueObject, uuid: { $ne: uuid } });

      if (doesExist) throw Error('duplicate data found');
    }

    const now = Date.now();
    const dataToWrite = {
      ...data,
      updated_time: now,
    };

    global.spiderman.db[collection].updateOne({ uuid }, dataToWrite);
  }

  function remove({ collection, uuid }) {
    global.spiderman.db[collection].deleteMany({ uuid: { $in: uuid } });
  }

  function filterExistUuids({ collection, uuids }) {
    return global.spiderman.db[collection]
      .find({ uuid: { $in: uuids } })
      .map((item) => item.uuid);
  }

  function handleRelatedUuids({ collection, field, uuids }) {
    const items = global.spiderman.db[collection].find();

    const newItems = items.map((item) => {
      const result = global.spiderman._.get(item, field);
      if (Array.isArray(result)) {
        const newResult = result.filter((uuid) => !uuids.includes(uuid));
        global.spiderman._.set(item, field, newResult);
      } else if (typeof result === 'string') {
        global.spiderman._.set(item, field, null);
      }
      return item;
    });

    global.spiderman.db[collection].set(newItems);
  }

  return {
    find,
    insertOne,
    insertMany,
    modify,
    remove,
    filterExistUuids,
    handleRelatedUuids,
  };
};
