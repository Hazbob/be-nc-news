const apiRouter = require("express").Router();
const articleRouter = require("./article-router.js");
const topicsRouter = require("./topics-router.js");
const userRouter = require("./user-router.js");
const commentsRouter = require("./comments-router.js");

apiRouter.use("/articles", articleRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
