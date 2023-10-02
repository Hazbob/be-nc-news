function invalidPathHandler(req, res, next) {
  res.status(404).send({ message: "Path Does Not Exist" });
}

function handleCustomError(err, req, res, next) {
  if (err.status) {
    const { message } = err;
    res.status(404).send({ message });
  }
  next(err);
}

function handlePsqlError(err, req, res, next) {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  }
  next(err);
}

module.exports = {
  invalidPathHandler,
  handleCustomError,
  handlePsqlError,
};
