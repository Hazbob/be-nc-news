function invalidPathHandler(req, res, next) {
  res.status(404).send({ message: "Path Does Not Exist" });
}

function handleCustomError(err, req, res, next) {
  if (err.status === 404) {
    const { message } = err;
    return res.status(404).send({ message });
  }
  next(err);
}

function handlePsqlError(err, req, res, next) {
  if (err.code === "22P02" || err.code === "23502") {
    return res.status(400).send({ message: "Bad Request" });
  }
  if (err.code === "23503" && err.table === "comments") {
    return res.status(404).send({ message: "User Not Found" });
  }
  next(err);
}

module.exports = {
  invalidPathHandler,
  handleCustomError,
  handlePsqlError,
};
