const express = require("express");
const api = require("./routes/index");
const cors = require("cors");
const {
  notFoundForAll,
  sqlErrors,
  costumErrors,
  serverErrors,
} = require("./controllers/errors.controller.js");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", api);

app.all("/*", notFoundForAll);

app.use(sqlErrors);

app.use(costumErrors);

app.use(serverErrors);

module.exports = app;
