const fs = require('fs');
const { uuid: uuidv4 } = require('uuidv4');

module.exports = () => {
  const results = {};

  async function verifyFace(data) {
    if (!data.verify_mode) data.verify_mode = 0;

    const { client_id: identity, device_uuid: code } = data;
    const tablet = global.spiderman.db.tablets.findOne({ identity, code });
    if (!tablet) {
      throw Error('item not found');
    }
    const { uuid: sourceId } = tablet;
    const { verify_target_score: targetScore } = tablet;

    // if (!results[sourceId]) {
    const ret = await global.spiderman.request.make({
      url: `http://${global.params.localhost}/system/verifyface`,
      method: 'POST',
      pool: { maxSockets: 10 },
      time: true,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
      json: {
        source_id: sourceId,
        target_score: targetScore,
        verify_mode: data.verify_mode,
        base64_image: data.face_image,
      },
    });

    delete results[sourceId];
    // }

    // return sourceId;
    return ret.verify_uuid;
  }

  function verifyCard(data) {
    if (!data.verify_mode) data.verify_mode = 0;

    const {
      client_id: identity, device_uuid: code, card_number: cardNumber, timestamp,
    } = data;
    const tablet = global.spiderman.db.tablets.findOne({ identity, code });
    if (!tablet) {
      throw Error('item not found');
    }
    const { uuid: sourceId } = tablet;

    delete results[sourceId];
    const person = global.spiderman.db.person.findOne({ card_number: cardNumber })
      || global.spiderman.db.visitor.findOne({ card_number: cardNumber });

    const vid = uuidv4();
    const msg = {
      source_id: sourceId,
      verify_uuid: vid,
      target_score: data.target_score,
      timestamp: data.timestamp,
      verify_mode: 2,
    };

    if (person) {
      msg.person = person;
      msg.match = !!person;
      msg.face_image = readDisplayPhoto(person.uuid);
    }

    // support new api for person http/ws
    global.spiderman.socket.broadcastMessage({
      wss: global.spiderman.server.wsVerifyresults,
      message: JSON.stringify(msg),
    });

    if (person) {
      // for person
      global.spiderman.socket.broadcastMessage({
        wss: global.spiderman.server.wsRecognized,
        message: JSON.stringify(msg),
      });
    } else {
      // for stranger
      global.spiderman.socket.broadcastMessage({
        wss: global.spiderman.server.wsNonrecognized,
        message: JSON.stringify(msg),
      });
    }

    const simulationData = {
      source_id: sourceId,
      match: !!person,
      is_person: !!person,
      target_score: 0.5,
      face_image: '',
      timestamp,
      verify_uuid: '',
      person,
    };
    setResult(simulationData);

    global.domain.workerResult.triggerByResult(simulationData);

    return sourceId;
  }

  // function readRegisterPhoto(uuid) {
  //   const dbPhotoFolder = `${global.params.dataPath}/db/dbPhoto/`;
  //   let photo = '';
  //   try {
  //     if (uuid) {
  //       const registerPhotoFile = `${dbPhotoFolder}${uuid}.register`;
  //       photo = fs.readFileSync(registerPhotoFile).toString('utf8');
  //     }
  //   } catch (e) {
  //     console.log('readRegisterPhoto', e);
  //   }
  //   return photo;
  // }

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

  function setResult(data) {
    const { verify_uuid: uuid } = data;
    results[uuid] = reconstructData(data);
  }

  function reconstructData(data) {
    let ret = {};

    ret._id = uuidv4();

    if (data.is_person) {
      ret.person_info = {
        fullname: data.person.name,
        employeeno: data.person.id,
        email_address: data.person.extra_info.email,
        group_list: [],
        department_list: [],
        // group_list: data.person.group_list,
        // department_list: [data.person.extra_info.department],
        cardno: data.person.extra_info.cardno || '',
        expiration_date: data.person.extra_info.expiration_date || '',
        organization: data.person.extra_info.organization || '',
        title: data.person.extra_info.title,
        mobile: data.person.extra_info.phone_number,
        headshot: '',
        relation_to: '',
        relation_to_name: '',
        relationship: '',
        encrypt: false,
      };

      if (data.person.group_list) {
        data.person.group_list.forEach((g) => {
          ret.person_info.group_list.push({ id: uuidv4(), groupname: g });
        });
        ret.groups = data.person.group_list;
      }

      if (data.person.department_list) {
        data.person.department_list.forEach((d) => {
          ret.person_info.department_list.push({ id: uuidv4(), name: d });
        });
      }

      ret.person_id = data.person.uuid;
    } else {
      ret.person = {
        group_list: [],
        department_list: [],
        // group_list: data.nearest_person.group_list,
        // department_list: [data.nearest_person.person_info.department],
        headshot: '',
        relation_to: '',
        relation_to_name: '',
        relationship: '',
        encrypt: false,
      };

      if (data.nearest_person) {
        ret.person.fullname = data.nearest_person.person_info
          ? data.nearest_person.person_info.name
          : '';
        ret.person.employeeno = data.nearest_person.person_info
          ? data.nearest_person.person_info.id
          : '';
        ret.person.email_address = data.nearest_person.person_info
          ? data.nearest_person.person_info.email
          : '';
        ret.person.cardno = data.nearest_person.person_info
          ? data.nearest_person.person_info.cardno
          : '';
        ret.person.expiration_date = data.nearest_person.person_info
          ? data.nearest_person.person_info.expiration_date
          : 0;
        ret.person.organization = data.nearest_person.person_info
          ? data.nearest_person.person_info.organization
          : '';
        ret.person.title = data.nearest_person.person_info
          ? data.nearest_person.person_info.title
          : '';
        ret.person.mobile = data.nearest_person.person_info
          ? data.nearest_person.person_info.phone_number
          : '';

        if (data.nearest_person.person_info) {
          if (data.nearest_person.person_info.group_list) {
            data.nearest_person.person_info.group_list.forEach((g) => {
              ret.person.group_list.push({ id: uuidv4(), groupname: g });
            });

            ret.groups = data.nearest_person.person_info.group_list;
          }

          if (data.nearest_person.department_list) {
            data.nearest_person.department_list.forEach((d) => {
              ret.person.department_list.push({ id: uuidv4(), name: d });
            });
          }
          ret.person_id = data.nearest_person.person_info.uuid;
        }
      }
    }

    let score = 0.0;
    if (data.verify_score) {
      score = data.verify_score;
    }

    if (data.merged != null) ret.merged = data.merged;
    if (data.merged_verify_uuid != null) ret.merged_verify_uuid = data.merged_verify_uuid;
    if (data.non_action != null) ret.non_action = data.non_action;

    ret = {
      ...{
        type: data.is_person ? 1 : 0,
        ackstatus: 0,
        create_time: 0,
        last_modify_time: 0,
        last_recognized: {
          timestamp: 0,
          face_id_number: '',
        },
        // _created_at: '',
        // _updated_at: '',
        score,
        // score: 0.9,
        target_score: data.target_score,
        // snapshot: data.face_image,
        // snapshot: 'i1707117871252_9e95279228dd8683.jpg',
        // channel: data.source_id,
        // channel: 'Tablet-01',
        channel: data.channel,
        timestamp: data.timestamp,
        verify_face_id: data.verify_uuid,
        action_enable: 1,
        clock_mode_function: 0,
        request_client_param: 'fcs',
      },
      ...ret,
    };

    // ret = {
    //   type: 1,
    //   ackstatus: 0,
    //   person_info: {
    //     fullname: 'sdfasdf',
    //     employeeno: 'aa',
    //     email_address: 'username@abc.com',
    //     group_list: [
    //       {
    //         id: '62a7007e94104e0c02e1502b',
    //         groupname: 'Administrator',
    //       },
    //     ],
    //     department_list: [
    //       {
    //         id: 'ETJycKaTCO',
    //         name: 'Department-03',
    //       },
    //     ],
    //     cardno: '1',
    //     expiration_date: '',
    //     organization: '2',
    //     title: '4',
    //     mobile: '5',
    //     headshot: '',
    //     relation_to: '',
    //     relation_to_name: '6',
    //     relationship: '7',
    //     encrypt: false,
    //   },
    //   create_time: 1694489316876,
    //   last_modify_time: 1707098494560,
    //   last_recognized: { timestamp: 1707098494355, face_id_number: 'lmfr6sqtHciGTnlALqPf01Pq' },
    //   // person_id: '64ffdae439bc3f0c80029955',
    //   person_id: ret.person_id,
    //   score: 0.999593,
    //   target_score: 0.85,
    //   snapshot: 'i1707117871252_9e95279228dd8683.jpg',
    //   channel: 'Tablet-01',
    //   // timestamp: 1707117871252,
    //   timestamp: data.timestamp,
    //   // verify_face_id: '65c08d2fcf79770c7e22dbe0',
    //   verify_face_id: data.verify_uuid,
    //   action_enable: 1,
    //   request_client_param: 'fcs',
    //   groups: [],
    //   // _id: '9aa53200-c3f7-11ee-8f8b-1d7a70734924',
    //   _id: ret._id,
    // };

    return ret;
  }

  function getResult(verifyUuid) {
    const result = results[verifyUuid];
    if (!result) throw Error('item not found.');

    return result;
  }

  return {
    verifyFace,
    verifyCard,
    setResult,
    getResult,
  };
};
