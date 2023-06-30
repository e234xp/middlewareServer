const fs = require('fs');

module.exports = ({ workingFolder, collection: { name } }) => {
  const FOLIDER_PATH = `${workingFolder}/${name}`;

  function findOne(path) {
    const FILE_PATH = `${FOLIDER_PATH}/${path}`;

    try {
      const image = fs
        .readFileSync(FILE_PATH)
        .toString('utf8');
      return image;
    } catch {
      throw Error(`can not found image ${FILE_PATH}`);
    }
  }

  function insertOne(path, image) {
    const FILE_PATH = `${FOLIDER_PATH}/${path}`;

    fs.writeFileSync(FILE_PATH, image);
  }

  function deleteOne(path) {
    const FILE_PATH = `${FOLIDER_PATH}/${path}`;

    fs.unlinkSync(FILE_PATH);
  }

  async function deleteMany(paths) {
    await Promise.allSettled(paths.map((path) => deleteOne(path)));
  }

  return {
    findOne,
    insertOne,
    deleteOne,
    deleteMany,
  };
};
