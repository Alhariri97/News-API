const db = require("../db/connection.js");
const { fetchUser } = require("../models/users.models");

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
    SET votes = votes + $1
    WHERE article_id = $2 RETURNING * ; `;
  return db.query(queryStr, [inc_votes, article_id]).then((response) => {
    if (!response.rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return response.rows;
  });
};
exports.updateArticleBody = (article_id, topic, title, body) => {
  let queryStr = `UPDATE articles
    SET title =  $1,
     body = $2,
      topic = $3
     WHERE article_id = $4 RETURNING * ;`;
  return db
    .query(queryStr, [title, body, topic, article_id])
    .then((response) => {
      if (!response.rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return response.rows;
    })
    .catch((err) => console.log(err));
};
// title, body, topic
exports.fetchAllArticles = (
  order = "desc",
  sort_by = "created_at",
  limit = 10,
  page = 1,
  topic
) => {
  const valiedTopic = [];
  const valiedSort = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  if (isNaN(page) || isNaN(limit)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  let queryStr = `
  SELECT articles.* ,COUNT(comments) AS comment_count
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id `;

  if (topic) {
    queryStr += `  WHERE articles.topic = $1 `;
    valiedTopic.push(topic);
  }

  if (valiedSort.includes(sort_by)) {
    queryStr += `  GROUP BY articles.article_id   ORDER BY articles.${sort_by} `;
    if (order === "desc" || order === "asc") {
      queryStr += `${order}`;
      queryStr += ` LIMIT ${limit} OFFSET (${page} - 1 ) * ${limit}`;
    } else {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
  } else {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  return db.query(queryStr, valiedTopic).then((response) => {
    if (!response.rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    } else {
      return response.rows;
    }
  });
};

exports.createArticle = async (author, title, body, topic) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  try {
    const checkForUser = await db.query(
      `SELECT * FROM users WHERE username = $1`,
      [author]
    );
    const checkForTopic = await db.query(
      `SELECT * FROM topics WHERE slug = $1`,
      [topic]
    );
    if (checkForUser.rows.length && checkForTopic.rows.length) {
      try {
        const { rows } = await db.query(
          `INSERT INTO articles ( author, title, body, topic) VALUES ($1, $2 , $3, $4) RETURNING *`,
          [author, title, body, topic]
        );
        const newArticle = await this.selectArticleById(rows[0].article_id);
        return newArticle;
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject({ status: 404, msg: "Username Not found !" });
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

exports.removeArticleById = async (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  try {
    let { rows } = await db.query(
      `SELECT articles FROM articles WHERE article_id = $1  ; `,
      [article_id]
    );
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    let deleteArticle = await db.query(
      `DELETE FROM articles WHERE article_id = $1  ; `,
      [article_id]
    );
    if (deleteArticle.command === "DELETE" && !deleteArticle.rows.length) {
      return;
    }
    return Promise.reject({ status: 500, msg: "internal server error" });
  } catch (err) {
    console.log(err);
  }
};
