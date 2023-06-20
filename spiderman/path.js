module.exports = (path) => {
  const pathProxy = new Proxy(path, {
    get(target, prop) {
      if (!(prop in target)) {
        throw Error(`path ${prop} does not exist.`);
      }
      return target[prop];
    },
  });

  return pathProxy;
};
