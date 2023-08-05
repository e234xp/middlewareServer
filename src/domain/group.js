const { uuid: uuidv4 } = require('uuidv4');

module.exports = () => {
  function findWithPerson({ uuid }) {
    const groups = global.spiderman.db.groups.find();
    const filteredGroups = uuid ? groups.filter((group) => group.uuid === uuid) : groups;

    if (uuid && filteredGroups.length === 0) return filteredGroups;

    const personList = global.spiderman.db.person.find();
    const visitorList = global.spiderman.db.visitor.find();

    // 將 groupList 填上 person_list 和 visitor_list
    const groupList = filteredGroups.map((group) => {
      const personListInGroup = personList
        .filter(
          (person) => person.group_list && person.group_list.includes(group.name),
        )
        .map((person) => ({
          uuid: person.uuid,
          id: person.id,
          name: person.name,
        }));
      const visitorListInGroup = visitorList
        .filter(
          (visitor) => visitor.group_list && visitor.group_list.includes(group.name),
        )
        .map((visitor) => ({
          uuid: visitor.uuid,
          id: visitor.id,
          name: visitor.name,
        }));

      return {
        ...group,
        person_list: personListInGroup,
        visitor_list: visitorListInGroup,
      };
    });

    if (uuid) return groupList;

    // 透過 person, visitor 的 assigned_group_list 產生假的 assignedGroupList 提供前端檢視
    const assignedGroupList = (() => {
      // 去重複
      const groupNameList = (() => {
        const personAssignedList = personList
          .filter((person) => !!person.assigned_group_list)
          .flatMap((person) => person.assigned_group_list);

        const visitorAssignedList = visitorList
          .filter((visitor) => !!visitor.assigned_group_list)
          .flatMap((visitor) => visitor.assigned_group_list);

        return [...new Set([...personAssignedList, ...visitorAssignedList])];
      })();

      // groupNameList 整理成 group 的格式
      const tmpResult = groupNameList.map((name) => {
        const personListInGroup = personList
          .filter(
            (person) => person.assigned_group_list && person.assigned_group_list.includes(name),
          )
          .map((person) => ({
            uuid: person.uuid,
            id: person.id,
            name: person.name,
          }));
        const visitorListInGroup = visitorList
          .filter(
            (visitor) => visitor.assigned_group_list && visitor.assigned_group_list.includes(name),
          )
          .map((visitor) => ({
            uuid: visitor.uuid,
            id: visitor.id,
            name: visitor.name,
          }));

        return {
          uuid: uuidv4(),
          name,
          remarks: '',
          fixed: true,
          no_edit: true,
          create_date: Date.now(),
          person_list: personListInGroup,
          visitor_list: visitorListInGroup,
          assgined_by_manager: true,
        };
      });

      return tmpResult;
    })();

    // 兩者合併
    return [...groupList, ...assignedGroupList];
  }

  function createAndModifyPersonGroup({
    name, remarks, person_uuid_list: personUuidList, visitor_uuid_list: visitorUuidList,
  }) {
    const doesExist = !!global.spiderman.db.groups.findOne({ name });

    if (doesExist) throw Error('The item has already existed.');

    global.spiderman.db.groups.insertOne({
      uuid: uuidv4(),
      name,
      remarks: remarks || '',
      create_date: Date.now(),
      fixed: false,
      no_edit: false,
    });

    addGroupToPerson({ name, personUuidList, visitorUuidList });
  }

  function modifyAndModifyPersonGroup({
    uuid, remarks, person_uuid_list: personUuidList, visitor_uuid_list: visitorUuidList,
  }) {
    const group = global.spiderman.db.groups.findOne({ uuid });

    if (!group) throw Error('Item not found.');

    global.spiderman.db.groups.updateOne({ uuid }, { remarks });

    removeGroupsFromPerson([group.name]);
    addGroupToPerson({ name: group.name, personUuidList, visitorUuidList });
  }

  function removeAndModifyPersonGroup({ uuid }) {
    const groupList = global.spiderman.db.groups.find({ uuid: { $in: uuid } });

    if (groupList.length === 0) throw Error('Item not found.');

    global.spiderman.db.groups.deleteMany({ uuid: { $in: uuid } });

    const groupNames = groupList.map((group) => group.name);
    removeGroupsFromPerson(groupNames);

    global.domain.crud.handleRelatedUuids({
      collection: 'emailcommands',
      field: 'to',
      uuids: uuid,
    });
    global.domain.crud.handleRelatedUuids({
      collection: 'emailcommands',
      field: 'cc',
      uuids: uuid,
    });
    global.domain.crud.handleRelatedUuids({
      collection: 'emailcommands',
      field: 'bcc',
      uuids: uuid,
    });
  }

  function addGroupToPerson({ name, personUuidList, visitorUuidList }) {
    personUuidList.forEach((uuid) => {
      const person = global.spiderman.db.person.findOne({ uuid });
      if (!person) return;
      global.spiderman.db.person.updateOne({ uuid }, {
        group_list: [...person.group_list, name],
      });
    });

    visitorUuidList.forEach((uuid) => {
      const visitor = global.spiderman.db.visitor.findOne({ uuid });
      if (!visitor) return;
      global.spiderman.db.visitor.updateOne({ uuid }, {
        group_list: [...visitor.group_list, name],
      });
    });
  }

  function removeGroupsFromPerson(names) {
    const personList = global.spiderman.db.person.find();
    const visitorList = global.spiderman.db.visitor.find();

    const newPersonList = personList.map((person) => {
      const newGroupList = person.group_list.filter((group) => !names.includes(group));
      return {
        ...person,
        group_list: newGroupList,
      };
    });

    const newVisitorList = visitorList.map((visitor) => {
      const newGroupList = visitor.group_list.filter((group) => !names.includes(group));
      return {
        ...visitor,
        group_list: newGroupList,
      };
    });

    global.spiderman.db.person.set(newPersonList);
    global.spiderman.db.visitor.set(newVisitorList);
  }

  return {
    findWithPerson,
    createAndModifyPersonGroup,
    modifyAndModifyPersonGroup,
    removeAndModifyPersonGroup,
  };
};
