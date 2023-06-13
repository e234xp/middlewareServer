const use = require('./use');
const useImage = require('./useImage');

module.exports = ({ workingFolder, collections }) => ({
  connect: () => {
    const db = {};
    collections.forEach(({
      name, type = 'general', defaultData = [], cache = {},
    }) => {
      if (type === 'general') {
        const dbInstance = use({
          workingFolder,
          collection: {
            name,
            defaultData,
            cache,
          },
        });
        db[name] = dbInstance;
      }

      // if (type === 'read-only') {

      // }

      if (type === 'image') {
        const dbInstance = useImage({ workingFolder, collection: { name } });
        db[name] = dbInstance;
      }
    });

    return db;
  },
});
