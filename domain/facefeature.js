module.exports = () => {
  // TODO 利用 global.spiderman.request.make 去要
  // function engineGenerate(base64Image, cb) {
  //   return new Promise((resolve) => {
  //     require('request')({
  //       url: `http://${global.localhost}/system/generatefacefeature`,
  //       method: 'POST',
  //       pool: { maxSockets: 10 },
  //       time: true,
  //       timeout: 5000,
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       json: { base64_image: base64Image },
  //     }, (error, response, body) => {
  //       if (cb) {
  //         cb(
  //           error,
  //           (body != null && body.face_image != null) ? body.face_image : '',
  //           (body != null && body.face_feature != null) ? body.face_feature : '',
  //           (body != null && body.upper_face_feature != null) ? body.upper_face_feature : '',
  //         );
  //       }
  //       resolve({
  //         error,
  //         face_image: (body != null && body.face_image != null) ? body.face_image : '',
  //         face_feature: (body != null && body.face_feature != null) ? body.face_feature : '',
  //         upper_face_feature: (body != null && body.upper_face_feature != null) ? body.upper_face_feature : '',
  //       });
  //     });
  //   });
  // }

  function engineGenerate() {
    return {
      faceImage: 'faceImage', faceFeature: 'faceFeature', upperFaceFeature: 'upperFaceFeature',
    };
  }

  return {
    engineGenerate,
  };
};
