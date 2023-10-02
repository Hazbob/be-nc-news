const { selectTopics, selectArticle } = require("../model/model");

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

module.exports = {
  getTopics,
  getArticle,
};
