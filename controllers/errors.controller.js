exports.sqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
};

exports.costumErrors = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
};

exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
};

exports.notFoundForAll = (req, res) => {
  res.status(404).send({ msg: "Not Found" });
};
