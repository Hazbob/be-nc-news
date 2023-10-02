const { getTopics } = require("./controllers/api.controller.js");

const { invalidPathHandler } = require("./controllers/error.controller.js");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.get("*", invalidPathHandler);
//general error handler
app.use((err, req, res, next) => {
  console.log(err);
});
module.exports = app;
