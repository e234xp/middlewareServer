module.exports = () => {
  // TODO 修改
//   function resize(base64Image) {
//     return global.spiderman.request.make({
//       url: `http://${global.spiderman.path.localhost}/system/resizeimage`,
//       method: 'POST',
//       pool: { maxSockets: 10 },
//       time: true,
//       timeout: 5000,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       json: { base64_image: base64Image },
//     });
//   }

  function resize(base64Image) {
    return base64Image || '';
  }

  return {
    resize,
  };
};
