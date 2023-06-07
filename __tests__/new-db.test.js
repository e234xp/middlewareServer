/* eslint-disable no-await-in-loop */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-undef */
const db = require('../utility/db')({
  workingFolder: '/Users/liaoguanjie/城智/middlewareServer/db',
  collections: [
    {
      name: 'newCollection',
    },
    {
      name: 'records',
    },
  ],
});

const dbInstance = db.connect();

// 連續寫入100筆，紀錄每次寫入的內容及時間
test.concurrent('測試寫入效能', async () => {
  const NUM_OF_OPS = 100;
  const PAUSE_DURATION = 10; // 暫停時間（以毫秒為單位）

  const records = {};
  for (let i = 0; i < NUM_OF_OPS; i += 1) {
    const startTime = performance.now();

    dbInstance.newCollection.insertOne({
      title: `title-${i}`,
      content: `content-${i}`,
    });

    const endTime = performance.now();
    records[i] = endTime - startTime;

    await new Promise((resolve) => setTimeout(resolve, PAUSE_DURATION));
  }

  console.log(`寫入每筆紀錄 ${JSON.stringify(records, null, 2)}`);
  dbInstance.records.insertOne({
    db: 'newCollection',
    action: 'insertOne',
    records,
  });
});

// 紀錄每次讀取的時間及結果
test.concurrent('測試讀取效能', async () => {
  const NUM_OF_OPS = 100;
  const PAUSE_DURATION = 50; // 暫停時間（以毫秒為單位）

  const records = {};
  for (let i = 0; i < NUM_OF_OPS; i += 1) {
    const startTime = performance.now();
    const data = dbInstance.newCollection.find();
    const endTime = performance.now();
    records[i] = {
      dataLength: data.length,
      time: endTime - startTime,
    };

    await new Promise((resolve) => setTimeout(resolve, PAUSE_DURATION));
  }

  console.log(`讀取每筆紀錄 ${JSON.stringify(records, null, 2)}`);
  dbInstance.records.insertOne({
    db: 'newCollection',
    action: 'find',
    records,
  });
});
