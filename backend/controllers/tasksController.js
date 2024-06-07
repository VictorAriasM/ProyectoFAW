import Tasks from "../models/taskModel.js";
import Users from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";

export const createTask = catchAsync(async (req, res) => {
  await Tasks.requiredSchema.validateAsync(req.body);

  const user = await Users.getUserById(req.body.owner);

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: `User with id ${req.body.owner} not found`,
    });
  }

  const task = await Tasks.createTask(req.body);
  res.status(201).json({
    status: "success",
    data: {
      task,
    },
  });
});

export const getTasks = catchAsync(async (req, res) => {
  const tasks = await Tasks.getTasks(req.query);
  res.status(200).json({
    status: "success",
    data: {
      tasks,
    },
  });
});

export const getTaskById = catchAsync(async (req, res) => {
  const task = await Tasks.getTaskById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

export const updateTask = catchAsync(async (req, res) => {
  const task = await Tasks.updateTask(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});
