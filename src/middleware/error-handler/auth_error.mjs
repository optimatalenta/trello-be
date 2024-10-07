export function AuthenticationErrorHandler(err, res) {
  return res.status(err.statusCode).json({
    message: "Not Authenticated",
    error: err.error,
  });
}

export function AuthorizationErrorHandler(err, res) {
  return res.status(err.statusCode).json({
    message: "Not Authorized",
    error: err.error,
  });
}
