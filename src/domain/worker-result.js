module.exports = () => {
  function init() {
    const receivePort = 9000;

    const server = global.spiderman.udp.create();

    server.on('listening', () => {
      const address = server.address();
      console.log(`接收伺服器正在監聽 ${address.address}:${address.port}`);
    });

    server.on('message', (message) => {
      const data = JSON.parse(message);
      global.domain.tabletverify.setResult(data);

      triggerByResult(data);
    });

    server.bind(receivePort);
  }

  function triggerByResult(data) {
    const rules = generateRules(data);
    if (rules.length === 0) return;

    const actions = rules.map(({ actions: tmp }) => tmp);
    triggerActions({ actions, data });
  }

  function triggerActions({ actions, data }) {
    actions.forEach((action) => {
      if (action.ioboxes.length > 0) triggerIoboxes(action.ioboxes);

      if (action.wiegand_converters.length > 0) {
        triggerWiegandConverters({
          wiegandConverters: action.wiegand_converters,
          cardNumber: data.person?.card_number,
        });
      }

      if (action.line_commands.length > 0) {
        triggerLineCommands({ lineCommands: action.line_commands, data });
      }

      if (action.line_commands.length > 0) {
        triggerEmailCommands({ emailCommands: action.email_commands, data });
      }

      if (action.http_commands.length > 0) {
        triggerHttpCommands({ httpCommands: action.http_commands, data });
      }
    });
  }

  function generateRules(data) {
    const result = (() => {
      const rules = global.spiderman.db.rules
        .find();

      const filterRules = global.spiderman._.flow([
        filterByDeviceGroups, filterBySchedule, filterByAccessTypeAndGroups,
      ]);

      return filterRules({ rules, data });
    })();

    return result.rules;
  }

  function filterByDeviceGroups({ rules, data }) {
    if (rules.length === 0) return { rules, data };

    const camera = global.spiderman.db.cameras.findOne({ uuid: data.source_id });
    const tablet = global.spiderman.db.tablets.findOne({ uuid: data.source_id });
    if (!camera && !tablet) return { rules: [], data };

    const device = camera || tablet;

    return {
      rules: rules.filter((rule) => device.divice_groups
        .some((group) => rule.condition.video_device_groups
          .includes(group))),
      data,
    };
  }

  function filterBySchedule({ rules, data }) {
    if (rules.length === 0) return { rules, data };

    const { date, time, dayOfWeek } = (() => {
      const now = global.spiderman.dayjs();
      const decimalTime = now.hour() + now.minute() / 60;
      const day = now.day();

      return {
        date: now.format('YYYY-MM-DD'),
        time: decimalTime,
        dayOfWeek: day,
      };
    })();

    rules = rules.filter((rule) => {
      const schedule = global.spiderman.db.schedules.findOne({ uuid: rule.condition.schedule });
      if (!schedule) return false;

      if (schedule.type === 'non-recurrent') {
        const isDateBetween = global.spiderman.dayjs(date).isBetween(schedule.start_date, schedule.end_date, 'day', '[]');
        const isTimeIn = !!schedule.times.find((t) => t <= time && time < t + 0.5);

        return isDateBetween && isTimeIn;
      } if (schedule.type === 'recurrent') {
        const times = schedule.times[dayOfWeek];
        if (!schedule.times[dayOfWeek]) {
          return false;
        }
        const isTimeIn = times.find((t) => t <= time && time < t + 0.5);

        return isTimeIn;
      }

      return false;
    });

    return {
      rules,
      data,
    };
  }

  function filterByAccessTypeAndGroups({ rules, data }) {
    if (rules.length === 0) return { rules, data };

    if (!data.match) {
      return {
        rules: rules.filter((rule) => rule.condition.access_type === 'unidentified'),
        data,
      };
    }

    const groupUuids = (() => {
      const groups = data.person.group_list;
      return groups
        .map((name) => {
          const group = global.spiderman.db.groups.findOne({ name });
          return group.uuid;
        });
    })();

    return {
      rules: rules
        .filter((rule) => rule.condition.access_type === 'identified')
        .filter((rule) => groupUuids
          .some((uuid) => rule.condition.groups
            .includes(uuid))),
      data,
    };
  }

  function triggerIoboxes(ioboxes) {
    ioboxes.forEach(({ uuid, iopoint }) => {
      global.domain.workerIobox.trigger({ uuid, iopoint });
    });
  }

  function triggerWiegandConverters({ wiegandConverters, cardNumber }) {
    wiegandConverters.forEach(({ uuid, is_special_card_number: isSpecialCardNumber }) => {
      global.domain.workerWiegand.trigger({ uuid, isSpecialCardNumber, cardNumber });
    });
  }

  function triggerLineCommands({ lineCommands, data }) {
    lineCommands.forEach((uuid) => {
      global.domain.triggerLineCommand.trigger({ uuid, data });
    });
  }

  function triggerEmailCommands({ emailCommands, data }) {
    emailCommands.forEach((uuid) => {
      global.domain.triggerEmailCommand.trigger({ uuid, data });
    });
  }

  function triggerHttpCommands({ httpCommands, data }) {
    httpCommands.forEach((uuid) => {
      global.domain.triggerHttpCommand.trigger({ uuid, data });
    });
  }

  return {
    init,
    triggerByResult,
  };
};
