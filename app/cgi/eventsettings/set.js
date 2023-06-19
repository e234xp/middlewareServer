const { uuid: uuidv4 } = require('uuidv4');

module.exports = (data) => {
  if (data.line_actions_list) {
    data.line_actions_list = data.line_actions_list.map((item) => {
      if (!item.uuid) {
        item.uuid = uuidv4();
      }
      return item;
    });
  }

  if (data.mail_actions_list) {
    data.mail_actions_list = data.mail_actions_list.map((item) => {
      if (!item.uuid) {
        item.uuid = uuidv4();
      }
      return item;
    });
  }

  if (data.http_actions_list) {
    data.http_actions_list = data.http_actions_list.map((item) => {
      if (!item.uuid) {
        item.uuid = uuidv4();
      }
      return item;
    });
  }

  global.spiderman.db.eventsettings.updateOne({}, data);

  return {
    message: 'ok',
  };
};
