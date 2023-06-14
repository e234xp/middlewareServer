const useFile = require('./useFile');
const useImage = require('./useImage');

module.exports = ({ workingFolder, collections }) => ({
  init: () => {
    const db = {};
    collections.forEach(({
      name, type = 'file', defaultData = [], cache = {},
    }) => {
      const dbInstance = (() => {
        let instance;
        switch (type) {
          case 'file':
            instance = useFile({
              workingFolder,
              collection: {
                name,
                defaultData,
                cache,
              },
            });
            break;

          case 'image':
            instance = useImage({ workingFolder, collection: { name } });
            break;

            // use mysql,...

          default:
            console.log(`Sorry, we are out of ${type}.`);
        }

        return instance;
      })();

      const dbInstanceProxy = new Proxy(dbInstance, {
        get(target, prop) {
          if (!(prop in target)) {
            throw Error(`Function ${prop} does not exist in ${name}.`);
          }
          return target[prop];
        },
      });

      db[name] = dbInstanceProxy;
    });

    return db;
  },
});
