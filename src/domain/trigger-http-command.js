module.exports = () => {
  function trigger({ uuid, data }) {
    const httpcommand = global.spiderman.db.httpcommands
      .findOne({ uuid });
    if (!httpcommand) return;

    const {
      url, method,
      username, password,
      fields,
      note,
    } = httpcommand;

    const requestConfig = (() => {
      const body = generateBody({
        method, fields, note, data,
      });
      return {
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
    })();

    console.log('requestConfig', requestConfig);
    global.spiderman.request.make(requestConfig);
  }

  function generateBody({
    method, fields, note, data,
  }) {
    const body = {};
    Object.entries(fields).forEach(([key, value]) => {
      const hasPersonFileds = !!data.person;

      const isFromLayerOne = key === 'timestamp'
        || key === 'foreHead_temperature'
        || (method === 'POST' && key === 'face_image');

      const isFormPerson = key === 'group_list'
        || key === 'card_number';

      const isFormPersonExtro = key === 'title'
        || key === 'department'
        || key === 'email'
        || key === 'phone_number'
        || key === 'extension_number'
        || key === 'remarks';

      if (isFromLayerOne) {
        body[value] = data[key];
      }

      if (isFormPerson && hasPersonFileds) {
        body[value] = data.person[key];
      }

      if (isFormPersonExtro && hasPersonFileds) {
        body[value] = data.person?.extra_info[key];
      }

      if (key === 'person_id' && hasPersonFileds) {
        body[value] = data.person?.id;
      }

      if (key === 'person_name' && hasPersonFileds) {
        body[value] = data.person?.name;
      }
    });

    if (!note) return body;

    if (method === 'POST') {
      body.note = `${note}`;

      return body;
    }

    const keyValuepairs = body.note.split('&');
    const othersFields = keyValuepairs.reduce((obj, pair) => {
      const tmp = obj;
      if (pair.indexOf('=') === -1) return tmp;

      const [key, value] = pair.split('=');
      tmp[key] = value;
      return tmp;
    }, {});

    return {
      ...body,
      ...othersFields,
    };
  }

  return {
    trigger,
  };
};
