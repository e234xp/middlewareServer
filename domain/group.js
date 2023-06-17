const { uuid: uuidv4 } = require('uuidv4');

module.exports = () => {
  function findGroupWithPerson({ uuid }) {
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

  return {
    findGroupWithPerson,
  };
};
