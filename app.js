const {
  getTopics,
  getArticle,
  getAllArticles,
  getCommentsOfArticle,
  postCommentToArticle,
  getUsers,
  getUpdatedArticle,
  getDeleteComment,
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

app.get("/api/articles/:article_id/comments", getCommentsOfArticle);
app.post("/api/articles/:article_id/comments", postCommentToArticle);


app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", getUpdatedArticle);

app.delete("/api/comments/:comment_id", getDeleteComment);

//error handlers
app.get("*", invalidPathHandler);

app.use(handleCustomError);

app.use(handlePsqlError);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something broke!");
});

module.exports = app;
