const express = require("express");

const articleRouter = express.Router();

const {
  getArticle,
  getAllArticles,
  getCommentsOfArticle,
  postCommentToArticle,
  getUpdatedArticle,
} = require("../controllers/api.controller");

articleRouter.route("/").get(getAllArticles);

articleRouter.route("/:article_id").get(getArticle).patch(getUpdatedArticle);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsOfArticle)
  .post(postCommentToArticle);

module.exports = articleRouter;
