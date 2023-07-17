import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Error } from "mongoose";
import { ApiError } from "../utils/ApiError";
import config from "../config/config";

export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("ERROR CONVERTING");
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("ERROR HANDLER");
  console.log(err);
  let { statusCode, message } = err;
  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res["locals"].errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === "development" && { stack: err.stack }),
  };

  if (config.env === "development") {
    console.error(err);
  }
  return res.status(statusCode).send(response);
};
