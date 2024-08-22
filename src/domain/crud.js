const { uuid: uuidv4 } = require('uuidv4');

module.exports = () => {
  function find({
    collection, query, sliceShift, sliceLength,
  }) {
    global.spiderman.systemlog.generateLog(4, `domain crud find collection=[${collection}] query=[${JSON.stringify(query)}] sliceShift=[${sliceShift}]`);

    const allData = global.spiderman.db[collection]
      .find(query);

    const totalLength = allData.length;

    const result = allData
      .slice(sliceShift, sliceShift + sliceLength);

    return { totalLength, result };
  }

  function insertOne({ collection, data, uniqueKeys = null }) {
    global.spiderman.systemlog.generateLog(4, `domain crud insertOne collection=[${collection}] data=[${JSON.stringify(data).substring(0, 150)}]`);

    if (uniqueKeys) {
      const uniqueObject = uniqueKeys
        .map((key) => [key, data[key]])
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      const doesExist = global.spiderman.db[collection]
        .findOne(uniqueObject);

      if (doesExist) {
        global.spiderman.systemlog.generateLog(4, `domain crud insertOne collection=[${collection}] duplicate data found`);
        throw Error('duplicate data found');
      }
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
    global.spiderman.systemlog.generateLog(4, `domain crud insertMany collection=[${collection}] data[0]=[${data ? data[0] : ''}]`);

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
    global.spiderman.systemlog.generateLog(4, `domain crud modify collection=[${collection}] uuid=[${uuid}]`);

    if (uniqueKeys) {
      const uniqueObject = uniqueKeys
        .map((key) => [key, data[key]])
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      const doesExist = global.spiderman.db[collection]
        .findOne({ ...uniqueObject, uuid: { $ne: uuid } });

      if (doesExist) {
        global.spiderman.systemlog.generateLog(4, `domain crud modify collection=[${collection}] duplicate data found`);
        throw Error('duplicate data found');
      }
    }

    const now = Date.now();
    const dataToWrite = {
      ...data,
      updated_time: now,
    };

    global.spiderman.systemlog.generateLog(4, `domain crud modify collection=[${collection}] uuid=[${uuid}] ok`);

    global.spiderman.db[collection].updateOne({ uuid }, dataToWrite);
  }

  function remove({ collection, uuid }) {
    global.spiderman.systemlog.generateLog(4, `domain crud remove collection=[${collection}] uuid=[${uuid}]`);

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
        const newResult = result
          .filter((r) => {
            if (typeof r === 'string') {
              return !uuids.includes(r);
            }
            if (typeof r === 'object' && r !== null && 'uuid' in r) {
              return !uuids.includes(r.uuid);
            }
            return false;
          });
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
