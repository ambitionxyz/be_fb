export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public isOperational: Boolean = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
