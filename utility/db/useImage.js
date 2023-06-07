const fs = require('fs');

module.exports = ({ workingFolder, collection: { name } }) => {
  const FOLIDER_PATH = `${workingFolder}/${name}`;

  function imageFindOne(fileName) {
    const FILE_PATH = `${FOLIDER_PATH}/${fileName}`;

    const image = fs.readFileSync(FILE_PATH).toString('utf8');
    return image;
  }

  return {
    imageFindOne,
  };
};
