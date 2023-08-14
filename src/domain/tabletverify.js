module.exports = () => {
  const results = {};

  async function verifyFace(data) {
    if (!data.verify_mode) data.verify_mode = 0;

    const { client_id: identity, device_uuid: code } = data;
    const tablet = global.spiderman.db.tablets.findOne({ identity, code });
    if (!tablet) {
      throw Error('item not found');
    }
    const { uuid: sourceId, verify_target_score: targetScore } = tablet;

    await global.spiderman.request.make({
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

    return sourceId;
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

  function setResult(data) {
    const { source_id: uuid } = data;
    const tablet = global.spiderman.db.tablets.findOne({ uuid });
    if (!tablet) return;

    data = reconstructData(data);

    results[uuid] = data;
  }

  function reconstructData(data) {
    return {
      person_info: {
        fullname: data.person.name,
        employeeno: data.person.id,
        email_address: data.person.extra_info.email,
        group_list: data.person.group_list,
        department_list: [data.person.extra_info.department],
        expiration_date: '',
        title: data.person.extra_info.title,
        mobile: data.person.extra_info.phone_number,
        headshot: '',
        relation_to: '',
        relation_to_name: '',
        relationship: '',
        encrypt: false,
      },
      create_time: 0,
      last_modify_time: 0,
      last_recognized: {
        timestamp: 0,
        face_id_number: '',
      },
      person_id: data.person.uuid,
      _created_at: '',
      _updated_at: '',
      score: data.is_person ? 1 : 0,
      target_score: data.target_score,
      snapshot: data.face_image,
      channel: data.source_id,
      timestamp: data.timestamp,
      verify_face_id: data.verify_uuid,
      action_enable: 1,
      request_client_param: 'fcs',
      groups: data.person.group_list,
    };
  }

  function getResult(sourceId) {
    const result = results[sourceId];
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
