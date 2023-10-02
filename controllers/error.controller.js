function invalidPathHandler(err, req, res, next) {
  console.log("hello");
  res.status(404).send("Path Does Not Exist");
}

module.exports = {
  invalidPathHandler,
};
