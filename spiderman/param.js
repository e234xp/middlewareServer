module.exports = (path) => {
  const pathProxy = new Proxy(path, {
    get(target, prop) {
      if (!(prop in target)) {
        throw Error(`params ${prop} does not exist.`);
      }
      return target[prop];
    },

    set(target, prop, value) {
      if (!(prop in target)) {
        throw Error(`params ${prop} does not exist.`);
      }
      target[prop] = value;
      return true;
    },
  });

  return pathProxy;
};
