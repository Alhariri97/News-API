const res = require("express/lib/response");
const db = require("../db/connection.js");

exports.selectArticleById = (article_id) => {
  let queryString = "SELECT * FROM articles ";

  if (article_id) {
    queryString += `WHERE article_id= $1;`;
  }
  return db.query(queryString, [article_id]).then((response) => {
    if (!response.rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return response.rows;
  });
};
