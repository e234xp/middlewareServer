const fs = require('fs');
// const jsonfile = require('jsonfile');

module.exports = ({ workingFolder, collection: { name } }) => {
  const FOLIDER_PATH = `${workingFolder}/${name}`;
  //    cache 格式: file:time
  const cacheData = new Map();

  function setCache({ file, item }) {
    const now = Date.now();
    const cache = getCache(file);
    if (cache) {
      cacheData.delete(cache.key);
    }
    cacheData.set(`${file}:${now}`, item);
  }

  function getCache(file) {
    const entry = Array.from(cacheData.entries())
      .find(([key]) => key.startsWith(file));
    if (!entry) return null;
    const [key, value] = entry;

    return { key, value };
  }

  function find({
    startTime, endTime, query = {},
  }) {
    const dir = fs.readdirSync(FOLIDER_PATH);

    const filterdFiles = dir.filter((file) => {
      const [fileName, type] = file.split('.');
      // TODO 如果命名更新，更改變數順序，看是否需要更改檔案名稱
      if (type !== 'db') return false;

      const [, fileStartTime, fileEndTime] = fileName.split('_');
      const v = (startTime <= fileStartTime && endTime >= fileEndTime)
      || (startTime >= fileStartTime && startTime >= fileEndTime)
      || (endTime >= fileStartTime && endTime >= fileEndTime);

      return v;
    });

    const allRecordsInFiles = filterdFiles.flatMap((file) => {
      const filePath = `${FOLIDER_PATH}/${file}`;
      const [fileName] = file.split('.');

      const cache = getCache(file);
      if (cache) {
        setCache({ file, item: cache.value });
      } else {
        const item = (() => {
          let fileString = fs.readFileSync(filePath).toString('utf8');
          if (fileString[0] === ',') {
            fileString = fileString.substring(1);
          }

          const fileArray = JSON.parse(`[${fileString}]`);

          return fileArray.map((i) => ({
            ...i,
            face_image_id: {
              f: `${fileName}`,
              uuid: i.verify_uuid,
            },
          }));
        })();

        setCache({ file, item });
      }

      return getCache(file).value;
    });

    const recordsInTimeRanges = allRecordsInFiles
      .filter(({ timestamp }) => startTime <= timestamp && endTime >= timestamp);

    const queriedRecords = Object.keys(query).length > 0
      ? global.utility.query({
        data: recordsInTimeRanges,
        queryObject: query,
      })
      : recordsInTimeRanges;

    return queriedRecords;
  }

  return {
    find,
  };
};
