module.exports = () => {
  // insertOne();
  // insertMany();
  // updateOne();

  // const account = findOne();

  const r = global.spiderman.db.personverifyresult
    .find({
      startTime: 1685404812102,
      endTime: 1685577599999 - 100000,
      query: {
        uuid: { $in: ['8c196432-3aca-4da4-a237-a9ebf87613e6'] },
      },
    });

  return {
    r,
    message: 'ok',
  };
};

function findOne() {
  const account = global.spiderman.db.account.findOne({ uuid: 'd7745790-e482-4eff-bc15-5487bcf8a4ab' });

  return account;
}

function insertOne() {
  const account = {
    username: 'Test',
    password: '123456',
    permission: 'User',
    remarks: 'remarks',
    fixed: false,
    create_date: Date.now(),
    last_modify_date: Date.now(),
  };
  global.spiderman.db.account.insertOne(account);
}

function insertMany() {
  const accounts = [
    {
      username: 'Test',
      password: '123456',
      permission: 'User',
      remarks: 'remarks',
      fixed: false,
      create_date: Date.now(),
      last_modify_date: Date.now(),
    },
    {
      username: 'Test2',
      password: '123456',
      permission: 'User',
      remarks: 'remarks',
      fixed: false,
      create_date: Date.now(),
      last_modify_date: Date.now(),
    },
    {
      username: 'Test3',
      password: '123456',
      permission: 'User',
      remarks: 'remarks',
      fixed: false,
      create_date: Date.now(),
      last_modify_date: Date.now(),
    },
  ];

  global.spiderman.db.account.insertMany(accounts);
}

function updateOne() {
  const account = global.spiderman.db.account.updateOne({ username: 'Test' }, { permission: 'C' });
  console.log(account);
}
