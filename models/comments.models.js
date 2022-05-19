const { query } = require("../db/connection.js");
const db = require("../db/connection.js");

exports.fetchAllComments = (article_id) => {
  let queryString = `SELECT * FROM comments WHERE article_id = $1`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.creatComment = (username, body, article_id) => {
  if (!body || !username) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(
      `INSERT INTO comments ( author, body, article_id) VALUES ($1, $2 , $3) RETURNING *`,
      [username, body, article_id]
    )
    .then((results) => {
      return results.rows[0];
    });
};
