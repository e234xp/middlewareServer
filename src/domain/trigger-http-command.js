const fs = require('fs');

module.exports = () => {
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
    const {
      https, method,
      user: username, pass: password,
      host, port,
      uri,
      custom_data: fields,
      note,
    } = action;

    const body = generateBody({
      method, uri, fields, note, data,
    });

    const url = `${https ? 'https://' : 'http://'}${host}${port ? `:${port}` : ''}${body}`;

    const requestConfig = {
      url,
      method,
      ...username && password
        ? {
          auth: {
            user: username,
            pass: password,
          },
        }
        : {},
      ...method === 'POST'
        ? {
          json: body,
        } : {
          qs: body,
        },
      timeout: 5000,
    };

    global.spiderman.request.make(requestConfig);
  }

  function generateBody({
    method, uri, fields, note, data,
  }) {
    let format = '';
    if (method === 'GET') {
      format = uri;
    } else {
      format = fields;
    }

    let body = {};

    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function getPersonInfo(field) {
      let ret = '';

      if (data.person) {
        if (data.person[field]) { ret = data.person[field]; }
      } else if (data.nearest_person) {
        if (data.nearest_person.person_info) {
          if (data.nearest_person.person_info[field]) {
            ret = data.nearest_person.person_info[field];
          } else if (data.nearest_person.person_info.extra_info) {
            if (data.nearest_person.person_info.extra_info[field]) {
              ret = data.nearest_person.person_info.extra_info[field];
            }
          }
        }
      }

      return ret;
    }

    if (format.indexOf('##VerifiedTimeStamp##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##VerifiedTimeStamp##'), 'g'),
        global.spiderman.dayjs(data.timestamp).format('YYYY/MM/DD HH:mm:ss'),
      );
    }
    if (format.indexOf('##IsStranger##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##IsStranger##'), 'g'),
        data.is_stranger ? 'True' : 'False',
      );
    }
    if (format.indexOf('##PersonId##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##PersonId##'), 'g'),
        getPersonInfo('id'),
      );
    }
    if (format.indexOf('##PersonName##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##PersonName##'), 'g'),
        getPersonInfo('name'),
      );
    }
    if (format.indexOf('##CardNumber##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##CardNumber##'), 'g'),
        getPersonInfo('card_number'),
      );
    }
    if (format.indexOf('##Group##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##Group##'), 'g'),
        getPersonInfo('group_list'),
      );
    }
    if (format.indexOf('##JobTitle##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##JobTitle##'), 'g'),
        getPersonInfo('title'),
      );
    }
    if (format.indexOf('##Department##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##Department##'), 'g'),
        getPersonInfo('department'),
      );
    }
    if (format.indexOf('##EmailAddress##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##EmailAddress##'), 'g'),
        getPersonInfo('email'),
      );
    }
    if (format.indexOf('##PhoneNumber##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##PhoneNumber##'), 'g'),
        getPersonInfo('phone_number'),
      );
    }
    if (format.indexOf('##ExtensionNumber##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##ExtensionNumber##'), 'g'),
        getPersonInfo('extension_number'),
      );
    }
    if (format.indexOf('##Remarks##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##Remarks##'), 'g'),
        getPersonInfo('remarks'),
      );
    }
    if (format.indexOf('##Temperature##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##Temperature##'), 'g'),
        data.foreHead_temperature ? '' : data.foreHead_temperature,
      );
    }
    if (format.indexOf('##IsHighTemperature##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##IsHighTemperature##'), 'g'),
        data.foreHead_temperature ? 'True' : 'False',
      );
    }
    if (method === 'POST' && format.indexOf('##RegisterPhoto##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##RegisterPhoto##'), 'g'),
        '',
      );

      body.face_image = readRegisterPhoto(data.person?.uuid ?? null);
    }
    if (method === 'POST' && format.indexOf('##DisplayPhoto##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##DisplayPhoto##'), 'g'),
        '',
      );

      body.face_image = readDisplayPhoto(data.person?.uuid ?? null);
    }
    if (method === 'POST' && format.indexOf('##CapturedPhoto##') >= 0) {
      format.replace(
        new RegExp(escapeRegExp('##CapturedPhoto##'), 'g'),
        '',
      );

      body.face_image = data.face_image;
    }

    if (method === 'POST') {
      try { format = JSON.parse(format); } catch (ex) { console.log(ex); }
      body = { ...body, ...format };
      if (note) { body.note = note; }
    } else if (method === 'GET') {
      if (note) format += (`&${note}`);
    }

    return body;
  }

  return {
    trigger,
  };
};
