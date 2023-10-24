const apiRouter = require("./routes/api-router");

const cors = require("cors")

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
// app.use(cors())
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})

app.use("/api", apiRouter);

app.get("*", invalidPathHandler);

app.use(handleCustomError);

app.use(handlePsqlError);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something broke!");
});

module.exports = app;
