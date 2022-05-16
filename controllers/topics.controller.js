const { selectAllTopics } = require("../models/topics.models.js");

exports.getTopics = (req, res) => {
  selectAllTopics().then((data) => {
    res.status(200).send(data);
  });
};
