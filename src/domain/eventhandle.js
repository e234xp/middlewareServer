const { uuid: uuidv4 } = require('uuidv4');

module.exports = () => {
  async function find({
    uuid, actionType, sliceShift, sliceLength,
  }) {
    const { totalLength, result } = await global.domain.crud
      .find({
        collection: 'eventhandle',
        query: {
          ...(!uuid ? {} : { uuid }),
          ...(!actionType ? {} : { action_type: { $in: actionType } }),
        },
        sliceShift,
        sliceLength,
      });

    return {
      totalLength, result,
    };
  }

  function create(data) {
    const repeatItem = global.domain.crud.find({
      collection: 'eventhandle',
      query: { name: data.name },
      sliceShift: 0,
      sliceLength: 10000,
    });

    if (repeatItem.totalLength >= 1) {
      throw Error('Name existed. type: eventhandle');
    }

    data.uuid = uuidv4();
    global.domain.crud.insertOne({
      collection: 'eventhandle',
      data,
      uniqueKeys: ['name'],
    });
  }

  async function modify({ uuid, data }) {
    const repeatItem = global.domain.crud.find({
      collection: 'eventhandle',
      query: { name: data.name, uuid: { $ne: uuid } },
      sliceShift: 0,
      sliceLength: 10000,
    });

    if (repeatItem.totalLength >= 1) {
      throw Error('Name existed. type: eventhandle');
    }

    global.domain.crud.modify({
      collection: 'eventhandle',
      uuid,
      data,
      uniqueKeys: ['name'],
    });
  }

  function remove({ uuid }) {
    const repeatItem = global.domain.crud.find({
      collection: 'eventhandle',
      query: { uuid },
      sliceShift: 0,
      sliceLength: 10000,
    });
    if (!repeatItem) throw Error('Item not found.');

    global.domain.crud.remove({ collection: 'eventhandle', uuid });
  }

  return {
    find,
    create,
    modify,
    remove,
  };
};
