module.exports = () => {
  function remove(data) {
    // 如果在 collection 的 filed 當中有傳入的 uuids，就把他們去除
    global.domain.crud.handleRelatedUuids({
      collection: 'rules',
      field: 'actions.email_commands',
      uuids: data.uuid,
    });

    global.domain.crud.remove({
      collection: 'emailcommands',
      uuid: data.uuid,
    });
  }

  return {
    remove,
  };
};
