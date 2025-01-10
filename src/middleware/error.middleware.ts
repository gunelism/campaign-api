import { NextFunction, Request, Response } from "express";

export interface ApiErrorI extends Error {
  statusCode?: number;
  details?: unknown;
}

export class ApiError extends Error implements ApiErrorI {
  statusCode?: number;
  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode || 500;

  const errorMap: Record<string, { status: number; message: string }> = {
    ValidationError: { status: 400, message: "Invalid input" },
    UnauthorizedError: { status: 401, message: "Unauthorized access" },
  };

  const customError = errorMap[error.name];
  if (customError) {
    return res.status(customError.status).json({
      message: customError.message,
      ...(error.details && { details: error.details }),
    });
  }

  const logDetails = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    message: error.message,
    ...(process.env.NODE_ENV === "dev" && { stack: error.stack }),
    ...(error.details && { details: error.details }),
  };
  console.error(`[${statusCode}]`, JSON.stringify(logDetails, null, 2));

  const responsePayload = {
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "dev" && { stack: error.stack }),
  };

  return res.status(statusCode).json(responsePayload);
};

// enhancements
// 1. Integration with Monitoring Tools (sentr, datadog)
// 2. Request Tracking for Debugging, use request id (using middleware like express-request-id) to find correlated errors
// 3. Use log levels (e.g., info, warn, error)
// 4. Rate Limiting or Retry After Failures.
