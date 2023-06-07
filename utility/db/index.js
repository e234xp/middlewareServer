const use = require('./use');
const useImage = require('./useImage');

module.exports = ({ workingFolder, collections }) => ({
  connect: () => {
    const db = {};
    collections.forEach(({ name, type = 'json', defaultData }) => {
      if (type === 'json') {
        const dbInstance = use({ workingFolder, collection: { name, defaultData } });
        db[name] = dbInstance;
      }
      if (type === 'image') {
        const dbInstance = useImage({ workingFolder, collection: { name } });
        db[name] = dbInstance;
      }
    });

    return db;
  },
});
