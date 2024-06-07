import express from "express";
import * as tasksController from "../controllers/tasksController.js";

const tasksRouter = express.Router();

tasksRouter
  .route("/")
  .get(tasksController.getTasks)
  .post(tasksController.createTask);

tasksRouter
  .route("/:id")
  .get(tasksController.getTaskById)
  .patch(tasksController.updateTask);

export default tasksRouter;
