const express = require("express");
const api = require("./routes/index");
const cors = require("cors");
const {
  notFoundForAll,
  sqlErrors,
  costumErrors,
  serverErrors,
} = require("./controllers/errors.controller.js");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000/sign-up",
  })
);
app.use(express.json());

app.use("/api", api);

app.all("/*", notFoundForAll);

app.use(sqlErrors);

app.use(costumErrors);

app.use(serverErrors);

module.exports = app;
