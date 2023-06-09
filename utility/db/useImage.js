const fs = require('fs');

module.exports = ({ workingFolder, collection: { name } }) => {
  const FOLIDER_PATH = `${workingFolder}/${name}`;

  function imageFindOne(fileName) {
    const FILE_PATH = `${FOLIDER_PATH}/${fileName}`;

    const image = fs.readFileSync(FILE_PATH).toString('utf8');
    return image;
  }

  function imageInsertOne(fileName, image) {
    const FILE_PATH = `${FOLIDER_PATH}/${fileName}`;

    fs.writeFileSync(FILE_PATH, image);
  }

  return {
    imageFindOne,
    imageInsertOne,
  };
};
