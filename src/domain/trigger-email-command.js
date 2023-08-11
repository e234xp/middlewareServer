module.exports = () => {
  const triggered = {};

  function trigger({ uuid, data }) {
    const triggeredKey = generateTriggeredKey({ uuid, data });
    if (triggered[triggeredKey]) return;

    const emailCommand = global.spiderman.db.emailcommands
      .findOne({ uuid });
    if (!emailCommand) return;
    const {
      host, port, security, email, password, sender, subject,
      fields, note,
    } = emailCommand;

    const { toEmails, ccEmails, bccEmails } = (() => {
      const {
        to: toGroupUuids, cc: ccGroupUuids, bcc: bccGroupUuids,
      } = emailCommand;

      const theToEmails = (() => {
        if (toGroupUuids.length === 0) return [];
        const groupNames = global.spiderman.db.groups
          .find({ uuid: { $in: toGroupUuids } })
          .map((group) => group.name);

        return global.spiderman.db.person
          .find({ group_list: { $some: groupNames } })
          .map((person) => person.extra_info.email);
      })();

      const theCcEmails = (() => {
        if (ccGroupUuids.length === 0) return [];
        const groupNames = global.spiderman.db.groups
          .find({ uuid: { $in: ccGroupUuids } })
          .map((group) => group.name);

        return global.spiderman.db.person
          .find({ group_list: { $some: groupNames } })
          .map((person) => person.extra_info.email);
      })();

      const theBccEmails = (() => {
        if (bccGroupUuids.length === 0) return [];
        const groupNames = global.spiderman.db.groups
          .find({ uuid: { $in: bccGroupUuids } })
          .map((group) => group.name);

        return global.spiderman.db.person
          .find({ group_list: { $some: groupNames } })
          .map((person) => person.extra_info.email);
      })();

      return {
        toEmails: theToEmails,
        ccEmails: theCcEmails,
        bccEmails: theBccEmails,
      };
    })();

    const message = generateMessage({ fields, note, data });

    const sendConfig = {
      host,
      port,
      security,
      email,
      password,
      sender,
      subject,

      to: toEmails,
      cc: ccEmails,
      bcc: bccEmails,

      body: message,
      images: [data.face_image],
    };

    global.spiderman.mailer.send(sendConfig);
    handleTriggeredKey(triggeredKey);
  }

  function generateTriggeredKey({ uuid, data }) {
    return `${data.source_id}-${uuid}-${data.person?.uuid ?? 'stranger'}`;
  }

  function handleTriggeredKey(triggeredKey) {
    const COOL_DOWN_TIME = 60 * 1000;
    triggered[triggeredKey] = true;

    setTimeout(() => {
      delete triggered[triggeredKey];
    }, COOL_DOWN_TIME);
  }

  function generateMessage({ fields, note, data }) {
    let message = fields.reduce((acc, cur) => {
      const { key, value } = (() => {
        if (cur === 'timestamp') {
          const time = global.spiderman.dayjs(data[cur]).format('YYYY/MM/DD HH:mm:ss');
          return {
            key: '時間',
            value: time,
          };
        }

        if (cur === 'foreHead_temperature') {
          return {
            key: '額溫',
            value: data.foreHead_temperature,
          };
        }

        if (cur === 'person_id') {
          return {
            key: '編號',
            value: data.person?.id,
          };
        }

        if (cur === 'person_name') {
          return {
            key: '全名',
            value: data.person?.name,
          };
        }

        if (cur === 'group_list') {
          return {
            key: '群組',
            value: data.person?.group_list,
          };
        }

        if (cur === 'card_number') {
          return {
            key: '卡號',
            value: data.person?.card_number,
          };
        }

        if (cur === 'title') {
          return {
            key: '職稱',
            value: data.person?.extra_info.title,
          };
        }

        if (cur === 'department') {
          return {
            key: '部門',
            value: data.person?.extra_info.department,
          };
        }

        if (cur === 'email') {
          return {
            key: 'email',
            value: data.person?.extra_info.email,
          };
        }

        if (cur === 'phone_number') {
          return {
            key: '手機',
            value: data.person?.extra_info.phone_number,
          };
        }

        if (cur === 'extension_number') {
          return {
            key: '分機',
            value: data.person?.extra_info.extension_number,
          };
        }

        if (cur === 'remarks') {
          return {
            key: '備註',
            value: data.person?.extra_info.remarks,
          };
        }

        return {
          key: null,
          value: null,
        };
      })();

      if (value) {
        acc += `${key}: ${value}\n`;
      }

      return acc;
    }, '');

    if (note) {
      message += `\n${note}`;
    }

    return message;
  }

  return {
    trigger,
  };
};
