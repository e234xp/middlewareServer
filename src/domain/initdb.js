module.exports = () => {
  async function init() {
    const { db, defaultdata } = global.spiderman;

    console.log(Object.keys(defaultdata));
    // todo 所有的 init 實作

    db.videogroups.set(defaultdata.videogroups);
  }

  return {
    init,
  };
};
