const use = require('./use');

module.exports = ({ workingFolder, collections }) => ({
  connect: () => {
    const db = {};
    collections.forEach(({ name, defaultData }) => {
      const dbInstance = use({ workingFolder, collection: { name, defaultData } });
      db[name] = dbInstance;
    });

    return db;
  },
});
