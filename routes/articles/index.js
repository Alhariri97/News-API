const articlesRouter = require("express").Router();

const {
  getArticleById,
  patchArticleById,
  getAllArticles,
  postArticle,
  patchArticleBody,
  deleteArticleById,
} = require("../../controllers/article.controller");
const {
  getAllComments,
  postComment,
} = require("../../controllers/comments.controller");

articlesRouter.route("/").get(getAllArticles).post(postArticle);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .put(patchArticleBody)
  .delete(deleteArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getAllComments)
  .post(postComment);

module.exports = articlesRouter;
