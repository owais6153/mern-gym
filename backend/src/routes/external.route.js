import express from "express";
import { task_create_validation } from "./validation/app.route.validation.js";
import TaskController from "../controllers/app/task.controller.js";

const ExternalRouter = express.Router();

ExternalRouter.post("/task/create", task_create_validation, TaskController.create);

export default ExternalRouter;
