const {
  fetchAllComments,
  creatComment,
  removeComment,
  updateComment,
} = require("../models/comments.models.js");
const { selectArticleById } = require("../models/article.models");

exports.getAllComments = (req, res, next) => {
  const { limit, page } = req.query;
  const { article_id } = req.params;
  Promise.all([
    fetchAllComments(article_id, limit, page),
    selectArticleById(article_id),
  ])
    .then((data) => {
      res.status(200).send({ comments: data[0] });
    })
    .catch(next);
};
exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  creatComment(username, body, article_id)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  updateComment(comment_id, inc_votes)
    .then(([data]) => {
      res.status(200).send({ updatedComment: data });
    })
    .catch((err) => {
      next(err);
    });
};
