const { selectSnacks } = require("../model/model");

function invalidPathHandler(req, res, next) {
  res.status(200).send({ message: "Path Does Not Exist" });
}

function getTopics(req, res, next) {
  return selectSnacks().then((data) => {
    res.status(200).send(data);
  });
}

module.exports = {
  getTopics,
  invalidPathHandler,
};
