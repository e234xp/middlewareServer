const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
};

module.exports = () => {
  function circularJson(data) {
    let reqData = null;
    const circularReplacedata = JSON.stringify(data, getCircularReplacer());
    reqData = JSON.parse(circularReplacedata);

    return reqData;
  }

  function json(data) {
    let reqData = null;
    if (typeof data === 'string') {
      reqData = JSON.parse(data);
    } else if (typeof data === 'object') {
      reqData = data;
    }

    return reqData;
  }

  return {
    circularJson,
    json,
  };
};
