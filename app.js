const {
  getTopics,
  getArticle,
  getAllArticles,
  getCommentsOfArticle,
} = require("./controllers/api.controller.js");

const {
  invalidPathHandler,
  handleCustomError,
  handlePsqlError,
} = require("./controllers/error.controller.js");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsOfArticle);

app.get("*", invalidPathHandler);

app.use(handleCustomError);

app.use(handlePsqlError);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something broke!");
});

module.exports = app;
