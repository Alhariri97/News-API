const { selectAllTopics, createTopic } = require("../models/topics.models.js");

exports.getTopics = (req, res, next) => {
  selectAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  createTopic(slug, description)
    .then((body) => {
      res.status(201).send(body);
    })
    .catch(next);
};
