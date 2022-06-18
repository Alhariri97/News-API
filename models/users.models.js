const db = require("../db/connection.js");

const bcrypt = require("bcrypt");

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

exports.createUser = async (username, name, avatar_url, email, password) => {
  try {
    const hashedPasswrod = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      `INSERT INTO users (username, name, avatar_url, email, password) VALUES ($1, $2 , $3, $4, $5); `,
      [username, name, avatar_url, email, hashedPasswrod]
    );
    console.log(rows);
    return rows;
  } catch (err) {
    console.log(err);
  }
};
