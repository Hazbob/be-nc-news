const fs = require("fs/promises");

const { selectTopics } = require("../model/model");
const endpoints = require("../endpoints.json");

function getEndpoints(req, res, next) {
  res.status(200).send({ endpoints });
}

function getTopics(req, res, next) {
  return selectTopics().then((data) => {
    const topics = data.rows;
    res.status(200).send({ topics });
  });
}

module.exports = {
  getTopics,
  getEndpoints,
};
