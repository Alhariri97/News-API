const db = require("../db/connection.js");

exports.fetchAllUsers = () => {
  return db
    .query(`SELECT username FROM users;`)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => console.log(err));
};

exports.fetchUser = async (username) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM users WHERE username = $1;`,
      [username]
    );
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return rows;
  } catch (err) {
    return Promise.reject(err);
  }
};
