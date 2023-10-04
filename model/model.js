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
    let errorMessage = `ID(${articleId}) does not match any article`;
    return Promise.reject({
      status: 404,
      message: errorMessage,
    });
  }
  return articleData.rows;
}

async function selectAllArticles() {
  const articles = await db.query(`
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments) as comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;

    `);
  return articles.rows;
}

async function selectCommentsOfArticle(articleId) {
  const comments = await db.query(
    `
  SELECT * FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC;
  `,
    [articleId]
  );

  return comments.rows;
}

async function insertCommentOnArticle(articleId, author, body) {
  const metaData = [articleId, author, body];

  const query = await db.query(
    `
  INSERT INTO comments(article_id, author, body)
  VALUES
    ($1, $2, $3)
    RETURNING *;
  `,
    metaData
  );
  return query.rows;
}

module.exports = {
  selectTopics,
  selectArticle,
  selectAllArticles,
  selectCommentsOfArticle,
  insertCommentOnArticle,
};
