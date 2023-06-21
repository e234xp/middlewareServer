module.exports = () => {
  // TODO 改為該 API
  // function engineGenerate(base64Image) {
  //   return global.spiderman.request.make({
  //     url: `http://${global.spiderman.param.localhost}/system/generatefacefeature`,
  //     method: 'POST',
  //     pool: { maxSockets: 10 },
  //     time: true,
  //     timeout: 5000,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     json: { base64_image: base64Image },
  //   });
  // }

  function test() {
    return global.spiderman.request.make({
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      method: 'GET',
    });
  }

  function engineGenerate() {
    return {
      faceImage: 'faceImage', faceFeature: 'faceFeature', upperFaceFeature: 'upperFaceFeature',
    };
  }

  return {
    engineGenerate,
    test,
  };
};
