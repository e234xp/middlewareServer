module.exports = () => ({
  data: ({ data, fieldChecks }) => {
    const errorMessage = 'Invalid parameter.';
    if (!data) throw Error(errorMessage);

    const isValidated = fieldChecks.every(({ fieldName, fieldType, required }) => {
      const fieldValue = data[fieldName];
      const isFieldExist = fieldValue !== undefined && fieldValue !== null;

      if (!isFieldExist) {
        return !required;
      }

      if (fieldType === 'array') {
        return Array.isArray(fieldValue);
      }

      if (fieldType === 'object') {
        return !Array.isArray(fieldValue) && typeof fieldValue === 'object';
      }

      if (fieldType === 'nonempty') {
        return typeof fieldValue === 'string' && fieldValue.trim().length > 0;
      }

      // eslint-disable-next-line valid-typeof
      return typeof fieldValue === fieldType;
    });

    if (!isValidated) throw Error(errorMessage);

    // 只回傳 fieldChecks 裡面有的欄位
    const filteredData = fieldChecks.reduce((acc, { fieldName }) => {
      acc[fieldName] = data[fieldName];

      return acc;
    }, {});

    return filteredData;
  },
});
