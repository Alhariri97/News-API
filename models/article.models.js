const db = require("../db/connection.js");

exports.selectArticleById = (article_id) => {
  let queryString = `SELECT articles.*, COUNT(comments) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
 `;

  if (article_id) {
    queryString += ` WHERE articles.article_id = $1
    GROUP BY articles.article_id`;
  }
  return db.query(queryString, [article_id]).then((response) => {
    if (!response.rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return response.rows;
  });
};

exports.updateArticle = (article_id, inc_votes) => {
  let queryStr = `UPDATE articles
    SET votes = $1
    WHERE article_id = $2 RETURNING * ; `;
  return db.query(queryStr, [inc_votes, article_id]).then((response) => {
    if (!response.rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return response.rows;
  });
};

exports.fetchAllArticles = () => {
  const queryStr = `
  SELECT articles.title, articles.title, articles.topic, articles.author, articles.votes, articles.article_id, articles.created_at,  COUNT(comments) AS comment_count
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;
  `;
  return db.query(queryStr).then((response) => {
    return response.rows;
  });
};
