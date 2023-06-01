'use strict';
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
      if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
              return;
          }
          seen.add(value);
      }
      return value;
  };
};

exports.circularJsonParser = function( data ) {
  let reqData = null;
  try{
      let circularReplacedata = JSON.stringify(data, getCircularReplacer());;
      reqData = JSON.parse(circularReplacedata);
  }
  catch(e){};
  return reqData;
}

exports.jsonParser = function( data ) {
    let reqData = null;
    try{
        if( typeof data === 'string' ) {
            reqData = JSON.parse(data);
        }
        else if( typeof data === 'object' ) {
            reqData = data;
        }
    }
    catch(e){};
    return reqData;
}
