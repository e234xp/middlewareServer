const dataParser = require('../utility/dataParser');

module.exports = ({ req, res }) => {
  try {
    const { cgi } = req.params;

    const router = {
      generatetoken: require('./new-cgi/generatetoken'),
    };
    if (!router[cgi]) {
      throw Error('no such cgi');
    }

    const body = dataParser.circularJsonParser(req.body);
    res.status(200).json(router[cgi](body));
  } catch (error) {
    handleError(error, res);
  }
};

function handleError(error, res) {
  console.log(error);
  const errorCode = {
    'no such cgi': 400,
    unauthorized: 401,
  }[error.message] ?? 400;

  res.status(errorCode).json({ message: error.message });
}
