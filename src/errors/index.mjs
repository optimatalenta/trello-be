class AppError extends Error {
  constructor(message, statusCode, error) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends AppError {
  constructor(message, error) {
    super(message, 403, error);
  }
}

export class AuthorizationError extends AppError {
  constructor(message, error) {
    super(message, 401, error);
  }
}

export class UploadError extends AppError {
  constructor(message, error) {
    super(message, 500, error);
  }
}

export class CustomError extends AppError {
  constructor(statusCode, message, error) {
    super(message, statusCode, error);
  }
}
