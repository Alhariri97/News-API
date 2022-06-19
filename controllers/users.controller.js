const {
  fetchAllUsers,
  fetchUser,
  createUser,
} = require("../models/users.models");

exports.getAllUsers = (req, res) => {
  fetchAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.postUser = (req, res) => {
  const { username, name, avatar_url, email, password } = req.body;
  createUser(username, name, avatar_url, email, password)
    .then(([createdUser]) => {
      // console.log(newUser);
      res.status(201).send(createdUser);
    })
    .catch((err) => console.log(err, "this is error"));
};

exports.getUser = (req, res, next) => {
  const { username, password } = req.body;
  fetchUser(username, password)
    .then(([user]) => {
      res.status(200).send(user);
    })
    .catch(next);
};
