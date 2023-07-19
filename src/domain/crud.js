const { uuid: uuidv4 } = require('uuidv4');

module.exports = () => {
  function find({
    collection, query, shift, sliceLength,
  }) {
    const result = global.spiderman.db[collection]
      .find(query)
      .slice(shift, shift + sliceLength);

    return result;
  }

  async function insertOne({ collection, data }) {
    const now = Date.now();

    const dataToWrite = {
      uuid: uuidv4(),
      ...data,
      created_time: now,
      updated_time: now,
    };

    global.spiderman.db[collection].insertOne(dataToWrite);
  }

  async function insertMany({ collection, data }) {
    const now = Date.now();

    data = data.map((item) => ({
      uuid: uuidv4(),
      ...item,
      created_time: now,
      updated_time: now,
    }));

    global.spiderman.db[collection].insertMany(data);
  }

  async function modify({
    collection, uuid, data,
  }) {
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

  return {
    find,
    insertOne,
    insertMany,
    modify,
    remove,
  };
};
