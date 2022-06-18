const usersRouter = require("express").Router();
const {
  getAllUsers,
  getUser,
  postUser,
} = require("../../controllers/users.controller");

usersRouter.route("/").get(getAllUsers).post(postUser);
usersRouter.route("/:username").get(getUser);

module.exports = usersRouter;
