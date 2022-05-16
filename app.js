const express = require("express");

const { getTopics } = require("./controllers/topics.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.use((req, res) => {
  res.status(404).send({ msg: "invalid path / page Not found" });
});

module.exports = app;
