const { fetchAllComments } = require("../models/comments.models.js");
const { selectArticleById } = require("../models/article.models");

exports.getAllComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchAllComments(article_id), selectArticleById(article_id)])
    .then((data) => {
      res.status(200).send({ comments: data[0] });
    })
    .catch(next);
};
