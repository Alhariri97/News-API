const db = require("../db/connection.js");

exports.fetchAllUsers = () => {
  return db
    .query(`SELECT username FROM users;`)
    .then((data) => {
      console.log(data.rows);
      return data.rows;
    })
    .catch((err) => console.log(err));
};
