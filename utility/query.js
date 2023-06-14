module.exports = () => ({ data, queryObject }) => data
  .filter((item) => _isMatchConditions({ item, queryObject }));

function _isMatchConditions({ item, queryObject }) {
  return Object.entries(queryObject).every(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).every(
        ([op, opValue]) => _handleSpecialOperators(op, opValue, item[key]),
      );
    }
    return item[key] === value;
  });
}

function _handleSpecialOperators(key, value, item) {
  if (key === '$in') {
    if (Array.isArray(value) && value.includes(item)) {
      return true;
    }
    return false;
  }

  if (key === '$lt') {
    if (typeof item === 'number' && item < value) {
      return true;
    }
    return false;
  }

  if (key === '$lte') {
    if (typeof item === 'number' && item <= value) {
      return true;
    }
    return false;
  }

  if (key === '$gt') {
    if (typeof item === 'number' && item > value) {
      return true;
    }
    return false;
  }

  if (key === '$gte') {
    if (typeof item === 'number' && item >= value) {
      return true;
    }
    return false;
  }

  return false;
}
