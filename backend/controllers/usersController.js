import Users from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";

export const createUser = catchAsync(async (req, res) => {
  const user = await Users.createUser(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const getUsers = catchAsync(async (_req, res) => {
  const users = await Users.getUsers();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await Users.getUserById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const loginUser = catchAsync(async (req, res) => {
  const user = await Users.loginUser(req.body.email, req.body.password);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
