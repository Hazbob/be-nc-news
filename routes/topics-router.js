const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/api.controller.js");

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
