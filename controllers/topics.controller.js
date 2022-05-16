const { selectAllTopics } = require("../models/topics.models.js");

exports.getTopics = (req, res) => {
  selectAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
