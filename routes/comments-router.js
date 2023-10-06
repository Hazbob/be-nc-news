const commentsRouter = require("express").Router();

const { getDeleteComment } = require("../controllers/api.controller");

commentsRouter.route("/:comment_id").delete(getDeleteComment);

module.exports = commentsRouter;
