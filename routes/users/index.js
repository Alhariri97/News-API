const usersRouter = require("express").Router();
const {
  getAllUsers,
  getUser,
  postUser,
} = require("../../controllers/users.controller");

usersRouter.route("/").get(getAllUsers);
usersRouter.route("/register").post(postUser);

usersRouter.route("/login").post(getUser);

module.exports = usersRouter;
