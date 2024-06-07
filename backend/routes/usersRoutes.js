import * as usersController from "../controllers/usersController.js";
import express from "express";

const usersRouter = express.Router();

usersRouter
  .route("/")
  .get(usersController.getUsers)
  .post(usersController.createUser);

usersRouter.route("/:id").get(usersController.getUserById);

usersRouter.route("/login").post(usersController.loginUser);

export default usersRouter;
