module.exports = () => ({
  data: ({ data, fieldChecks }) => {
    const errorMessage = 'invalid parameter.';
    if (!data) throw Error(errorMessage);

    const isValidated = fieldChecks.every(({ fieldName, fieldType, required }) => {
      const isFieldExist = data[fieldName] !== undefined && data[fieldName] !== null;
      if (required && !isFieldExist) {
        throw Error(errorMessage);
      }

      if (isFieldExist) {
        if (fieldType === 'array') {
          return Array.isArray(data[fieldName]);
        }

        if (fieldType === 'object') {
          return !Array.isArray(data[fieldName]) && typeof data[fieldName] === 'object';
        }
        // eslint-disable-next-line valid-typeof
        if (typeof data[fieldName] !== fieldType) {
          console.log(fieldName, typeof data[fieldName], fieldType);
          throw Error(errorMessage);
        }
      }

      return true;
    });

    if (!isValidated) throw Error(errorMessage);

    const filteredData = fieldChecks.reduce((acc, { fieldName }) => {
      acc[fieldName] = data[fieldName];

      return acc;
    }, {});

    return filteredData;
  },
});
