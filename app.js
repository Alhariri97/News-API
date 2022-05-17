const express = require("express");

const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
} = require("./controllers/getArticleById.controller.js");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.use((err, req, res) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
