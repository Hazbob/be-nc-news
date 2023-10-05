const {
  selectTopics,
  selectArticle,
  selectAllArticles,
  selectCommentsOfArticle,
  insertCommentOnArticle,
  updateArticle,
  deleteComment,
} = require("../model/model");

async function getTopics(req, res, next) {
  try {
    const data = await selectTopics();
    const topics = data.rows;
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
}

async function getArticle(req, res, next) {
  try {
    const { article_id } = req.params;
    const articleData = await selectArticle(article_id);
    res.status(200).send({ article: articleData });
  } catch (err) {
    next(err);
  }
}

async function getAllArticles(req, res, next) {
  try {
    const articles = await selectAllArticles();
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
}

async function getCommentsOfArticle(req, res, next) {
  const { article_id } = req.params;
  try {
    const promises = await Promise.all([
      selectArticle(article_id),
      selectCommentsOfArticle(article_id),
    ]);

    const comments = await selectCommentsOfArticle(article_id);

    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
}

async function postCommentToArticle(req, res, next) {
  try {
    const { username, body } = req.body;
    const { article_id } = req.params;

    const comment = await insertCommentOnArticle(article_id, username, body);

    res.status(201).send(comment);
  } catch (err) {
    next(err);
  }
}

async function getUpdatedArticle(req, res, next) {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const article = await updateArticle(inc_votes, article_id);
    res.status(200).send(article);
  } catch (err) {
    next(err);
  }
}
async function getDeleteComment(req, res, next) {
  try {
    const { comment_id } = req.params;
    const comment = await deleteComment(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
module.exports = {
  getTopics,
  getArticle,
  getAllArticles,
  getCommentsOfArticle,
  postCommentToArticle,
  getUpdatedArticle,
  getDeleteComment,
};
