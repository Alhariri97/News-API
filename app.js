const express = require("express");

const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  patchArticleById,
  getAllArticles,
} = require("./controllers/article.controller.js");

const {
  sqlErrors,
  costumErrors,
  serverErrors,
} = require("./controllers/errors.controller.js");

const { getAllUsers } = require("./controllers/users.controller");
const {
  getAllComments,
  postComment,
} = require("./controllers/comments.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/users", getAllUsers);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getAllComments);
app.post("/api/articles/:article_id/comments", postComment);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(sqlErrors);

app.use(costumErrors);

app.use(serverErrors);

module.exports = app;
