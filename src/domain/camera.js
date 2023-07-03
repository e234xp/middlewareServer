const { uuid: uuidv4 } = require('uuidv4');

module.exports = (collection = global.spiderman.db.cameras) => {
  function find({
    query, shift, sliceLength,
  }) {
    const result = collection
      .find(query)
      .slice(shift, shift + sliceLength);

    return result;
  }

  async function insert({ data }) {
    const now = Date.now();

    const dataToWrite = {
      uuid: uuidv4(),
      ...data,
      created_time: now,
      updated_time: now,
    };

    collection.insertOne(dataToWrite);
  }

  async function modify({
    uuid, data,
  }) {
    const now = Date.now();
    const dataToWrite = {
      ...data,
      updated_time: now,
    };

    collection.updateOne({ uuid }, dataToWrite);
  }

  function remove({ uuid }) {
    collection.deleteMany({ uuid: { $in: uuid } });
  }

  return {
    find,
    insert,
    modify,
    remove,
  };
};
