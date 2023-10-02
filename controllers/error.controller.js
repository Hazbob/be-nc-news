function invalidPathHandler(req, res, next) {
  res.status(404).send({ message: "Path Does Not Exist" });
}

module.exports = {
  invalidPathHandler,
};
