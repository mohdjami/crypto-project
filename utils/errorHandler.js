import AppError from "./appError.js";
const sendErrorInDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const handleDuplicateFieldError = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleCasteErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  console.log(message);
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data ${errors.join(", ")}`;
  return new AppError(message, 400);
};

const sendErrorInProduction = (err, res) => {
  //Operational error that is trusted send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Send generic error message for Programming or other unknown eror
    console.error("Error", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

export default (err, req, res, next) => {
  console.log(err);
  console.log(process.env.NODE_ENV);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // err.message = err.message || "Something went wrong";

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCasteErrorDB(error);
    if (error.errorResponse.code === 11000) {
      console.log("production error", error.errorResponse.code === 11000);

      error = handleDuplicateFieldError(error, res);
    }

    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    sendErrorInProduction(error, res);
  } else if (process.env.NODE_ENV === "development") {
    sendErrorInDevelopment(err, res);
  }
};
