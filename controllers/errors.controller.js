exports.sqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.costumErrors = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
};

exports.serverErrors = (err, req, res) => {
  res.status(500).send({ msg: "internal server error" });
};
