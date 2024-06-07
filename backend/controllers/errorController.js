const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

function errorController(error, _req, res, _next) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  // JOI validation errors
  if (error.details) {
    error.message = error.details.map((el) => el.message).join(". ");
    error.statusCode = 400;
  }

  console.error(error);

  if (process.env.NODE_ENV === "production") {
    sendErrorProd(error, res);
  } else {
    sendErrorDev(error, res);
  }
}

export default errorController;
