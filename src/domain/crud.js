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

  async function insert({ collection, data }) {
    const now = Date.now();

    const dataToWrite = {
      uuid: uuidv4(),
      ...data,
      created_time: now,
      updated_time: now,
    };

    global.spiderman.db[collection].insertOne(dataToWrite);
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
    insert,
    modify,
    remove,
  };
};
