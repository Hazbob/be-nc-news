const db = require("../db/connection");

async function selectTopics() {
  const topicData = db.query(`SELECT * FROM topics;`);
  return topicData;
}

async function selectArticle(articleId) {
  const articleData = await db.query(
    "SELECT * FROM articles  WHERE article_id=$1;",
    [articleId]
  );
  if (articleData.rows.length === 0 || !articleData.rows) {
    errorMessage = `ID(${articleId}) does not match any article`;
    return Promise.reject({
      status: 404,
      message: errorMessage,
    });
  }
  return articleData.rows;
}

module.exports = { selectTopics, selectArticle };
