const db = require("../db/connection.js");

exports.selectAllTopics = () => {
  return db
    .query(`SELECT * FROM topics;`)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => console.log(err));
};

//

exports.createTopic = async (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const { rows } = await db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING * ;`,
      [slug, description]
    )
    .catch((err) => Promise.reject(err));
  return { createdTopic: rows[0] };
};
