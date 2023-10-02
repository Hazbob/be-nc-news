const db = require("../db/connection");

function selectSnacks() {
  return db.query("SELECT * FROM topics;").then((data) => {
    return data;
  });
}

module.exports = { selectSnacks };
