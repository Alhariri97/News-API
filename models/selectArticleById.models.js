const res = require("express/lib/response");
const db = require("../db/connection.js");

exports.selectArticleById = (article_id) => {
  let queryString = "SELECT * FROM articles ";
  const queryVals = [];

  if (article_id) {
    queryString += `WHERE article_id= $1;`;
    queryVals.push(article_id);
  }
  return db.query(queryString, queryVals).then((response) => {
    if (!response.rows.length) {
      return Promise.reject({ status: 404, msg: "Invalid Id" });
    }
    return response.rows;
  });
};
