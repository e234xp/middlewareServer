const fieldChecks = [
  {
    fieldName: 'username',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'password',
    fieldType: 'string',
    required: true,
  },
  {
    fieldName: 'license',
    fieldType: 'string',
    required: true,
  },
];

module.exports = async (data) => {
  // paramters checker
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const accounts = global.spiderman.db.account.find({ username: data.username });

  if (accounts.length <= 0) {
    throw Error('Item not found.');
  } else {
    let response = null;

    try {
      response = await global.spiderman.request.make({
        url: `http://${global.params.localhost}/system/findlicense`,
        method: 'POST',
        pool: { maxSockets: 10 },
        time: true,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
        json: data,
      });

      // response.license = [
      //   {
      //     license_version: 10,
      //     corp_no: 1,
      //     trial_days: 0,
      //     vm: false,
      //     fre: true,
      //     frs: true,
      //     fcs_amount: 4,
      //     face_db_size: 0,
      //     api_call_amount: 1,
      //     uuid: '6E15024A-0835-628E-C4F9-48210B5179A8',
      //     mac: '48:21:0B:51:79:A830:89:4A:3B:F1:37',
      //     license_key: 'UVJUX-YYUSJ-TVFTY-TXTJY-IWRRG-XXJBB',
      //     activation_date: 1703041801441,
      //   },
      // ];
    } catch (e) {
      throw Error(`fatch license error. ${e.message}`);
    }

    if (response) {
      console.log('response.license', response.license);

      const licenses = response.license.filter((l) => l.license_key === data.license);
      if (licenses.length <= 0) {
        throw Error('license not found.');
      } else {
        accounts[0].last_modify_date = Date.now();
        accounts[0].password = data.password;

        global.spiderman.db.account.updateOne({ username: data.username }, accounts[0]);

        return {
          message: 'ok',
        };
      }
    } else {
      throw Error('license not found.');
    }
  }
};
