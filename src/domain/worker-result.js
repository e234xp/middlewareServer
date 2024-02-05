module.exports = () => {
  function init() {
    const receivePort = 9000;

    const server = global.spiderman.udp.create();

    server.on('listening', () => {
      const address = server.address();
      console.log(`接收伺服器正在監聽 worker-result ${address.address}:${address.port}`);
    });

    server.on('message', (message, rinfo) => {
      try {
        console.log('==============================================================');
        console.log(`message from enginee ${rinfo.address} ${rinfo.port}`);

        message = message.toString('utf8');

        const data = JSON.parse(message);
        // console.log('message from enginee', data.source_id, data.verify_uuid);
        // console.log('message from enginee', data);

        data.channel = '';
        data.divice_groups = [];

        let device = global.spiderman.db.cameras.findOne({ uuid: data.source_id });
        if (device) {
          data.channel = device.name || '';
          data.divice_groups = device.divice_groups || [];
        } else {
          device = global.spiderman.db.tablets.findOne({ uuid: data.source_id });

          if (device) {
            data.channel = device.identity || '';
            data.divice_groups = device.divice_groups || [];
          }
        }

        // 給 tablet
        global.domain.tabletverify.setResult(data);
        const newData = global.domain.tabletverify.getResult(data.verify_uuid);

        // console.log('=====================================');
        // newData.snapshot = 'i1707117871252_9e95279228dd8683.jpg';
        // console.log(newData);

        // 給 dash broad
        if (newData) {
          // support new api for person http/ws
          global.spiderman.socket.broadcastMessage({
            wss: global.spiderman.server.wsVerifyresults,
            message: JSON.stringify(newData),
          });

          if (data.is_person) {
            // for person
            global.spiderman.socket.broadcastMessage({
              wss: global.spiderman.server.wsRecognized,
              message: JSON.stringify(newData),
            });
          } else {
            // for stranger
            global.spiderman.socket.broadcastMessage({
              wss: global.spiderman.server.wsNonrecognized,
              message: JSON.stringify(newData),
            });
          }
          // console.log('message from worker-result', data);
        }

        // trigger result
        triggerByResult(data);
      } catch (e) {
        console.log('triggerByResult message', e);
      }
    });

    server.bind(receivePort);
  }

  function triggerByResult(data) {
    const rules = generateRules(data);

    if (rules.length === 0) return;

    triggerActions({ actions: rules, data });
  }

  function triggerActions({ actions, data }) {
    actions.forEach((action) => {
      switch (action.action_type) {
        case 'line':
          triggerLineCommands({ action, data });
          break;
        case 'http':
          triggerHttpCommands({ action, data });
          break;
        case 'mail':
          triggerEmailCommands({ action, data });
          break;
        default:

          break;
      }

      // if (action.ioboxes.length > 0) triggerIoboxes(action.ioboxes);

      // if (action.wiegand_converters.length > 0) {
      //   triggerWiegandConverters({
      //     wiegandConverters: action.wiegand_converters,
      //     cardNumber: data.person?.card_number,
      //   });
      // }

      // if (action.line_commands.length > 0) {
      //   triggerLineCommands({ lineCommands: action.line_commands, data });
      // }

      // if (action.email_commands.length > 0) {
      //   triggerEmailCommands({ emailCommands: action.email_commands, data });
      // }

      // if (action.http_commands.length > 0) {
      //   triggerHttpCommands({ httpCommands: action.http_commands, data });
      // }
    });
  }

  function generateRules(data) {
    const result = (() => {
      const eventhandle = global.spiderman.db.eventhandle.find();

      const filterRules = global.spiderman._.flow([
        filterByEnabledRule, filterByPersonGroups, filterByDeviceGroups, filterBySchedule,
      ]);

      return filterRules({ eventhandle, data });
    })();

    return result.eventhandle;
  }

  function filterByEnabledRule({ eventhandle, data }) {
    if (eventhandle.length === 0) return { eventhandle, data };

    return {
      eventhandle: eventhandle.filter((rule) => rule.enable === true),
      data,
    };
  }

  function filterByDeviceGroups({ eventhandle, data }) {
    if (eventhandle.length === 0) return { eventhandle, data };

    // const camera = global.spiderman.db.cameras.findOne({ uuid: data.source_id });
    // const tablet = global.spiderman.db.tablets.findOne({ uuid: data.source_id });
    // if (!camera && !tablet) return { eventhandle: [], data };

    // const device = camera || tablet;

    const retE = eventhandle.filter((rule) => {
      // let groups = [];
      rule.divice_groups = rule.divice_groups || [];

      // if (device) {
      // data.divice_groups = data.divice_groups || [];
      const groups = data.divice_groups
        .some((group) => rule.divice_groups
          .includes(group));
      // }

      return groups;
    });

    return {
      eventhandle: retE,
      data,
    };
  }

  function filterByPersonGroups({ eventhandle, data }) {
    if (eventhandle.length === 0) return { eventhandle, data };

    const passager = data.person ? data.person : data.nearest_person.person_info;

    const retE = eventhandle.filter((rule) => passager.group_list
      .some((group) => rule.group_list
        .includes(group)));

    console.log('filterByPersonGroups', retE);
    return {
      eventhandle: retE,
      data,
    };
  }

  function filterBySchedule({ eventhandle, data }) {
    if (eventhandle.length === 0) return { eventhandle, data };

    const { dayOfWeek, hour } = (() => {
      const now = global.spiderman.dayjs();
      // const decimalTime = now.hour() + now.minute() / 60;
      let day = now.day(); // 0 (Sunday) to 6 (Saturday)

      // change to schedule object weekday
      day -= 1;
      if (day < 0) day = 0;

      return {
        date: now.format('YYYY-MM-DD'),
        timestamp: now - 0,
        // time: decimalTime,
        dayOfWeek: day,
        hour: now.hour(),
      };
    })();

    eventhandle = eventhandle.filter((handle) => {
      const { specify_time: specifyTime, weekly_schedule: weeklySchedule } = handle;

      let ret = false;
      if (specifyTime) {
        for (let i = 0; i < specifyTime.list.length; i += 1) {
          const specify = specifyTime.list[i];
          if ((data.timestamp - specify.start_time) * (data.timestamp - specify.end_time) < 0) {
            ret = true;
            break;
          }
        }
      }

      if (!ret && weeklySchedule) {
        for (let i = 0; i < weeklySchedule.list.length; i += 1) {
          const week = weeklySchedule.list[i];
          if (week.day_of_week === dayOfWeek) {
            if (week.hours_list.indexOf(hour) >= 0) {
              ret = true;
              break;
            }
          }
        }
      }

      return ret;
    });

    console.log('filterBySchedule', eventhandle);
    return {
      eventhandle,
      data,
    };
  }

  // function triggerIoboxes(ioboxes) {
  //   ioboxes.forEach(({ uuid, iopoint }) => {
  //     global.domain.workerIobox.trigger({ uuid, iopoint });
  //   });
  // }

  // function triggerWiegandConverters({ wiegandConverters, cardNumber }) {
  //   wiegandConverters.forEach(({ uuid, is_special_card_number: isSpecialCardNumber }) => {
  //     global.domain.workerWiegand.trigger({ uuid, isSpecialCardNumber, cardNumber });
  //   });
  // }

  function triggerLineCommands({ action, data }) {
    global.domain.triggerLineCommand.trigger({ action, data });
  }

  function triggerEmailCommands({ action, data }) {
    global.domain.triggerEmailCommand.trigger({ action, data });
  }

  function triggerHttpCommands({ action, data }) {
    global.domain.triggerHttpCommand.trigger({ action, data });
  }

  return {
    init,
    triggerByResult,
  };
};
