const {
  selectArticleById,
  updateArticle,
  fetchAllArticles,
  createArticle,
  updateArticleBody,
  removeArticleById,
} = require("../models/article.models.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleBody = (req, res, next) => {
  const { article_id } = req.params;
  const { topic, title, body } = req.body;

  updateArticleBody(article_id, topic, title, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic, page, limit } = req.query;
  fetchAllArticles(order, sort_by, limit, page, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic } = req.body;
  createArticle(author, title, body, topic)
    .then((createdArticle) => {
      res.status(201).send({ createdArticle });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(() => {
      res.status(200).send({});
    })
    .catch(next);
};
