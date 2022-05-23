const {
  selectArticleById,
  updateArticle,
  fetchAllArticles,
  createArticle,
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

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchAllArticles(order, sort_by, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic } = req.body;
  createArticle(author, title, body, topic)
    .then((createdArticle) => {
      console.log(createdArticle, "article <<<<<<<<");
      res.status(201).send({ createdArticle });
    })
    .catch(next);
};
