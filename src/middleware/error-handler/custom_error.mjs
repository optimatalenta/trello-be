export function CustomErrorHandler(err, res) {
  return res.status(err.statusCode).json({
    message: err.message,
    errors: err.error,
  });
}
