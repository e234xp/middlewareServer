const fs = require('fs');

module.exports = ({
  workingFolder, collection: {
    name,
    cache: { isOpen: isOpenCache = false, maxBytes: maxBytesCache = 0 },
  },
}) => {
  const FOLIDER_PATH = `${workingFolder}/${name}`;
  //    cache 格式: file:time
  const cacheData = new Map();
  const cacheSizes = new Map();
  let cacheDataSize = 0;

  function setCache({ id, item }) {
    if (!isOpenCache) {
      return;
    }

    const cache = getCache(id);
    if (cache) {
      deleteCache(cache.key);
    }

    // 檢查 size 是否過大
    const size = global.utility.calculate.size(item);
    const isSetMax = maxBytesCache > 0;
    if (isSetMax && size > maxBytesCache) {
      console.log(`${id} is too big: ${size}, it won't set cache.`);
      return;
    }

    const now = Date.now();
    const key = `${id}:${now}`;
    cacheData.set(key, item);
    cacheSizes.set(key, size);
    cacheDataSize = sumMapValues(cacheSizes);

    // 讓 Cache 不要超過大小
    if (isSetMax) {
      while (cacheDataSize > maxBytesCache) {
        const oldestKey = getOldestCacheKey();
        if (!oldestKey) break;
        console.log('before cacheDataSize:', cacheDataSize);
        console.log('maxBytesCache:', maxBytesCache);
        console.log('cacheSizes: ', cacheSizes);
        console.log(`oldestKey: ${oldestKey}, deleted`);

        deleteCache(oldestKey);
        cacheDataSize = sumMapValues(cacheSizes);

        console.log('after cacheDataSize:', cacheDataSize);
      }
    }
  }

  function getCache(id) {
    if (!isOpenCache) {
      return null;
    }

    const entry = Array.from(cacheData.entries())
      .find(([key]) => key.startsWith(id));
    if (!entry) return null;
    const [key, value] = entry;

    return { key, value };
  }

  function deleteCache(key) {
    cacheData.delete(key);
    cacheSizes.delete(key);
  }

  function sumMapValues(map) {
    let sum = 0;
    map.forEach((value) => {
      sum += value;
    });
    return sum;
  }

  function getOldestCacheKey() {
    let oldestKey = null;
    let oldestTimestamp = Infinity;

    cacheSizes.forEach((value, key) => {
      const timestamp = Number(key.split(':')[1]);
      if (timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp;
        oldestKey = key;
      }
    });

    return oldestKey;
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

      const cache = getCache(fileName);
      if (cache) {
        setCache({ id: fileName, item: cache.value });

        return cache.value;
      }

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

      setCache({ id: fileName, item });

      return item;
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
