const { selectTopics } = require("../model/model");

function getTopics(req, res, next) {
  return selectTopics().then((data) => {
    const topics = data.rows;
    res.status(200).send({ topics });
  });
}

module.exports = {
  getTopics,
};
