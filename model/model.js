const db = require("../db/connection");

function selectTopics() {
  return db.query("SELECT * FROM topics;").then((data) => {
    return data;
  });
}

module.exports = { selectTopics };
