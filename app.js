const {
  getTopics,
  invalidPathHandler,
} = require("./controllers/api.controller.js");

const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("*", invalidPathHandler);
//general error handler
app.use((err, req, res, next) => {
  console.log(err);
});
module.exports = app;
