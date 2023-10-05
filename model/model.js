const { val } = require("cheerio/lib/api/attributes");
const db = require("../db/connection");

async function selectTopics() {
  const topicData = db.query(`SELECT * FROM topics;`);
  return topicData;
}

async function selectArticle(articleId) {
  const articleData = await db.query(
    `SELECT articles.*, COUNT(comments) as comment_count FROM articles
    LEFT JOIN comments on articles.article_id = comments.article_id
    WHERE articles.article_id=$1
    GROUP BY articles.article_id;`,
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

async function selectAllArticles(topic) {
  const validTopics = {
    mitch: "mitch",
    testtopicwithnoarticle: "testtopicwithnoarticle",
  };

  let query = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments) as comment_count 
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    if (!(topic in validTopics)) {
      return Promise.reject({ status: 400, message: "Invalid Topic" });
    }
    query += ` WHERE articles.topic = '${validTopics[topic]}'`;
  }

  query += ` GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;
  const articles = await db.query(query);
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
  return query.rows[0];
}

async function selectUsers() {
  const users = await db.query(`
  SELECT * FROM users;
  `);
  return users.rows;
}
async function updateArticle(votesNum, articleId) {
  if (!votesNum || !articleId) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  const article = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
    [votesNum, articleId]
  );

  if (article.rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "Article ID does not exist",
    });
  }
  return article.rows[0];
}

async function deleteComment(...commentId) {
  const comment = await db.query(
    `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `,
    commentId
  );

  if (comment.rows.length === 0) {
    return Promise.reject({ status: 404, message: "comment does not exist" });
  }
  return comment;
}

module.exports = {
  selectTopics,
  selectArticle,
  selectAllArticles,
  selectCommentsOfArticle,
  insertCommentOnArticle,
  selectUsers,
  updateArticle,
  deleteComment,
};
