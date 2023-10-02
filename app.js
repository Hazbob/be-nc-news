const { getTopics, getArticle } = require("./controllers/api.controller.js");

const {
  invalidPathHandler,
  handleCustomError,
  handlePsqlError,
} = require("./controllers/error.controller.js");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("*", invalidPathHandler);

app.use(handleCustomError);

app.use(handlePsqlError);

module.exports = app;
