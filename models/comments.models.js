const db = require("../db/connection.js");

exports.fetchAllComments = (article_id, limit = 10, page = 1) => {
  if (isNaN(page) || isNaN(limit)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  let queryString = `SELECT * FROM comments WHERE article_id = $1`;
  queryString += ` LIMIT ${limit} OFFSET (${page} - 1 ) * ${limit} ;`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (page > 1) {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    }

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
exports.removeComment = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *`,
      [comment_id]
    )
    .then((results) => {
      if (!results.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return results.rows;
    });
};
exports.updateComment = async (comment_id, inc_votes) => {
  if (inc_votes === -1 || inc_votes === 1) {
    try {
      const { rows } = await db.query(
        "SELECT * FROM comments WHERE comment_id = $1",
        [comment_id]
      );
      if (rows.length === 1) {
        let queryString = `UPDATE comments SET votes = votes + 1 WHERE comment_id = $1 RETURNING *`;
        if (inc_votes === -1) {
          queryString = `UPDATE comments SET votes = votes - 1 WHERE comment_id = $1 RETURNING * `;
        }
        const { rows } = await db.query(queryString, [comment_id]);
        return rows;
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    } catch (err) {
      return Promise.reject(err);
    }
  } else {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
};
