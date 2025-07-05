import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";
import AppError from "../utils/AppErrors";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookies";

const handleZodError = (res: Response, error: z.ZodError) => {
    const errors = error.issues.map((err) => ({
        path: err.path.join(","),
        message:err.message
    }))
    return res.status(BAD_REQUEST).json({
        message: error.message,
        errors: errors

    })
}

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error);

    if (error instanceof z.ZodError) {
        return handleZodError(res, error);
    }

      if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

    if (error instanceof z.ZodError) {
    return handleZodError(res, error);
    }

    if (error instanceof AppError) {
    return handleAppError(res, error);
    }




    return res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error")
}
export default errorHandler;
// This middleware is used to handle errors in the application. It logs the error and sends a 500 status code with a generic message.
// It is important to have this middleware at the end of the middleware stack so that it can catch any errors thrown in the routes or other middleware.
