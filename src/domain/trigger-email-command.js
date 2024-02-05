const fs = require('fs');

module.exports = () => {
  const triggered = {};
  function readRegisterPhoto(uuid) {
    const dbPhotoFolder = `${global.params.dataPath}/db/dbPhoto/`;
    let photo = '';
    try {
      if (uuid) {
        const registerPhotoFile = `${dbPhotoFolder}${uuid}.register`;
        photo = fs.readFileSync(registerPhotoFile).toString('utf8');
      }
    } catch (e) {
      console.log('readRegisterPhoto', e);
    }
    return photo;
  }

  function readDisplayPhoto(uuid) {
    const dbPhotoFolder = `${global.params.dataPath}/db/dbPhoto/`;
    let photo = '';
    try {
      if (uuid) {
        const displayPhotoFile = `${dbPhotoFolder}${uuid}.display`;
        photo = fs.readFileSync(displayPhotoFile).toString('utf8');
      }
    } catch (e) {
      console.log('readDisplayPhoto', e);
    }
    return photo;
  }

  function trigger({ action, data }) {
    const triggeredKey = generateTriggeredKey({ data });
    if (triggered[triggeredKey]) return;

    const {
      host, port, security, user: email, pass: password, from: sender, subject,
      data_list: fields, custom_data: note,
      to: toEmails, cc: ccEmails, bcc: bccEmails,
    } = action;

    const message = generateMessage({ fields, note, data });

    const image = (() => {
      let ret = '';
      if (fields.display_image === 'captured') {
        ret = `${data.face_image}`;
      } else if (fields.display_image === 'display') {
        ret = readDisplayPhoto(data.person?.uuid ?? null);
      } else if (fields.display_image === 'register') {
        ret = readRegisterPhoto(data.person?.uuid ?? null);
      }
      return ret;
    })();

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
      // images: [image],
    };

    if (image) {
      sendConfig.images = [image];
    }

    global.spiderman.mailer.send(sendConfig);
    handleTriggeredKey(triggeredKey);
  }

  function generateTriggeredKey({ data }) {
    return `${data.source_id}-${data.verify_uuid}-${data.person?.uuid ?? 'stranger'}`;
  }

  function handleTriggeredKey(triggeredKey) {
    const COOL_DOWN_TIME = 60 * 1000;
    triggered[triggeredKey] = true;

    setTimeout(() => {
      delete triggered[triggeredKey];
    }, COOL_DOWN_TIME);
  }

  function generateMessage({ fields, note, data }) {
    let message = '';

    Object.keys(fields).forEach((key1) => {
      switch (key1) {
        case 'foreHead_temperature':
          message += (`Temperature: ${data[key1]}\n`);
          break;
        case 'verified_timestamp':
          message += (`Datetime: ${global.spiderman.dayjs(data[key1]).format('YYYY/MM/DD HH:mm:ss')}\n`);
          break;
        case 'person':
          Object.keys(fields[key1]).forEach((key2) => {
            switch (key2) {
              case 'card_number':
                message += (`Card Number: ${fields[key1][key2]}\n`);
                break;
              case 'department':
                message += (`Department: ${fields[key1][key2]}\n`);
                break;
              case 'email':
                message += (`Email Address: ${fields[key1][key2]}\n`);
                break;
              case 'extension_number':
                message += (`Extension Number: ${fields[key1][key2]}\n`);
                break;
              case 'group_list':
                message += (`Groups: ${fields[key1][key2]}\n`);
                break;
              case 'id':
                message += (`Id: ${fields[key1][key2]}\n`);
                break;
              case 'name':
                message += (`Fullname: ${fields[key1][key2]}\n`);
                break;
              case 'phone_number':
                message += (`Phone Number: ${fields.person[key2]}\n`);
                break;
              case 'remarks':
                message += (`Remark: ${fields[key1][key2]}\n`);
                break;
              case 'title':
                message += (`Title: ${fields[key1][key2]}\n`);
                break;
              default:

                break;
            }
          });
          break;
        default:

          break;
      }
    });

    if (note) {
      message += `\n${note}`;
    }

    return message;
  }

  return {
    trigger,
  };
};
