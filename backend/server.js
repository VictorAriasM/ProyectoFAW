import express from "express";
import cors from "cors";
import errorController from "./controllers/errorController.js";
import sqlInjectionDetector from "./middleware/sqlInjectionDetector.js";
import AppError from "./utils/AppError.js";

//Routers
import usersRouter from "./routes/usersRoutes.js";
import tasksRouter from "./routes/tasksRouter.js";

const app = express();

// middleware
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(express.json());
app.use(sqlInjectionDetector);

// routes
app.use("/api/users", usersRouter);
app.use("/api/tasks", tasksRouter);

// 404 error handling middleware
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// error handling middleware
app.use(errorController);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
