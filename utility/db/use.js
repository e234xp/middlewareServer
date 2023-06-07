const fs = require('fs');
const jsonfile = require('jsonfile');

module.exports = ({ workingFolder, collection: { name, defaultData } }) => {
  const FILE_PATH = `${workingFolder}/${name}.json`;
  // 讀取資料
  function readData() {
    if (!fs.existsSync(workingFolder)) {
      fs.mkdirSync(workingFolder);
    }
    if (!fs.existsSync(FILE_PATH)) {
      return [];
    }
    return jsonfile.readFileSync(FILE_PATH);
  }

  // 寫入資料
  function writeData(data) {
    if (!fs.existsSync(workingFolder)) {
      fs.mkdirSync(workingFolder);
    }
    jsonfile.writeFileSync(FILE_PATH, data, { spaces: 2 });
  }

  // 建立資料
  function insertOne(item) {
    const data = readData();
    data.push(item);
    writeData(data);
  }

  // 建立多筆資料
  function insertMany(items) {
    const data = readData();
    data.push(...items);
    writeData(data);
  }

  // 搜尋資料
  function find(query) {
    const data = readData();
    if (!query) {
      return data;
    }
    return data
      .filter((item) => Object.keys(query).every((key) => item[key] === query[key]));
  }

  // 搜尋符合條件的單一資料
  function findOne(query) {
    const data = find(query);
    return data.length > 0 ? data[0] : null;
  }

  // 更新資料
  function updateOne(query, update) {
    const data = readData();
    const index = data
      .findIndex((item) => Object.keys(query).every((key) => item[key] === query[key]));
    if (index !== -1) {
      const updatedItem = { ...data[index], ...update };
      data[index] = updatedItem;
      writeData(data);
      return updatedItem;
    }
    return null;
  }

  // 刪除資料
  function deleteOne(query) {
    const data = readData();
    const index = data
      .findIndex((item) => Object.keys(query).every((key) => item[key] === query[key]));
    if (index !== -1) {
      const deletedItem = data[index];
      data.splice(index, 1);
      writeData(data);
      return deletedItem;
    }
    return null;
  }

  // 刪除符合條件的多筆資料
  function deleteMany(query) {
    const data = readData();
    const deletedItems = data
      .filter((item) => Object.keys(query).every((key) => item[key] === query[key]));
    const filteredData = data.filter((item) => !deletedItems.includes(item));
    writeData(filteredData);
    return deletedItems;
  }

  function set(items) {
    writeData(items);
    return items;
  }

  function reset() {
    return set(defaultData);
  }

  return {
    insertOne,
    insertMany,
    find,
    findOne,
    updateOne,
    deleteOne,
    deleteMany,
    set,
    reset,
  };
};
