const express = require("express");

const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
} = require("./controllers/getArticleById.controller.js");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.use((req, res) => {
  res.status(404).send({ msg: "invalid path / page Not found" });
});

module.exports = app;
