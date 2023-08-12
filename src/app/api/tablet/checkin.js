const fieldChecks = [
  {
    fieldName: 'client_id',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'device_uuid',
    fieldType: 'nonempty',
    required: true,
  },
  {
    fieldName: 'ip_address',
    fieldType: 'nonempty',
    required: true,
  },
];

module.exports = async (data) => {
  data = global.spiderman.validate.data({
    data,
    fieldChecks,
  });

  const sessionId = (() => {
    const account = global.spiderman.db.account.findOne({ username: 'Admin', password: '123456' });
    if (!account) throw Error('Unauthorized');

    const { username, password, permission } = account;
    return global.spiderman.token.encryptFromAccount({
      u: username,
      p: password,
      t: Date.now(),
      x: permission,
    });
  })();

  const tablet = global.spiderman.db.tablets.findOne({
    identity: data.client_id,
    code: data.device_uuid,
    ip_address: data.ip_address,
  });
  if (!tablet) throw Error('Item not found.');

  const cardNos = (() => {
    const groupNames = global.spiderman.db.groups
      .find({ uuid: { $in: tablet.group_list_to_pass } })
      .map((group) => group.name);

    const personCardNumbers = global.spiderman.db.person
      .find({ group_list: { $some: groupNames } })
      .map(({ card_number: cardNumber }) => (cardNumber));

    const visitorCardNumbers = global.spiderman.db.visitor
      .find({ group_list: { $some: groupNames } })
      .map(({ card_number: cardNumber }) => (cardNumber));

    return [
      ...personCardNumbers,
      ...visitorCardNumbers,
    ];
  })();

  const { sync_timezone: syncTimeZone, sync_time: syncTime } = await (async () => {
    const { time_zone: timeZone, timestamp } = await global.spiderman.request.make({
      url: `http://${global.params.localhost}/system/timeinfo`,
      method: 'POST',
      pool: { maxSockets: 10 },
      time: true,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
      json: data,
    });

    return {
      sync_timezone: timeZone,
      sync_time: Math.floor(timestamp / 1000),
    };
  })();

  return {
    sync_timezone: syncTimeZone,
    sync_time: syncTime,
    sessionId,
    cardNos,
    ...tablet,
  };
};
