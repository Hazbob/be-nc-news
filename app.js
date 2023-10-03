const {
  getTopics,
  getArticle,
  getAllArticles,
} = require("./controllers/api.controller.js");

const {
  invalidPathHandler,
  handleCustomError,
  handlePsqlError,
} = require("./controllers/error.controller.js");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getAllArticles);

app.get("*", invalidPathHandler);

app.use(handleCustomError);

app.use(handlePsqlError);

module.exports = app;
