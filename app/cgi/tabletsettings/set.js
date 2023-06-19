const { uuid: uuidv4 } = require('uuidv4');

module.exports = (data) => {
  if (data.access_control_schedule_list) {
    data.access_control_schedule_list = data.access_control_schedule_list.map((item) => {
      if (!item.uuid) {
        item.uuid = uuidv4();
      }
      return item;
    });
  }

  if (data.high_temperature_sound_alert_schedule_list) {
    data.high_temperature_sound_alert_schedule_list = data
      .high_temperature_sound_alert_schedule_list.map((item) => {
        if (!item.uuid) {
          item.uuid = uuidv4();
        }
        return item;
      });
  }

  global.spiderman.db.settings.updateOne({}, data);
  return {
    message: 'ok',
  };
};
