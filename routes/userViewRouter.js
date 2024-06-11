const express = require("express");
const userRouter = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");

//call controller
const userController = require("../controller/userController");

userRouter
  .route("/")
  .get(userController.register)
  .post(userController.registerPost);

userRouter
  .route("/login")
  .get(userController.login)
  .post(userController.signin);
userRouter.route("/logout").get(userController.signout);
userRouter
  .route("/dashboard")
  .get(ensureAuthenticated, userController.dashboard);

module.exports = userRouter;
