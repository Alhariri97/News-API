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
    SET votes = $1
    WHERE article_id = $2 RETURNING * ; `;
  return db.query(queryStr, [inc_votes, article_id]).then((response) => {
    if (!response.rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return response.rows;
  });
};

exports.fetchAllArticles = (order = "desc", sort_by = "created_at", topic) => {
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
  try {
    const checkForUser = await fetchUser(author);
    const checkForTopic = await db.query(
      `SELECT * FROM topics WHERE slug = $1`,
      [topic]
    );
    if (checkForUser.length === 1 && checkForTopic.rows.length) {
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
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
