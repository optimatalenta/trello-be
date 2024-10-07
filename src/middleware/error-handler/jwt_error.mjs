export function JWTErrorHandler(err, res) {
  switch (err.name) {
    case "TokenExpiredError":
      return res.status(401).json({
        message: err.message,
        errors: "Token expired",
      });

    case "VerifyErrors":
      return res.status(403).json({
        message: err.message,
        errors: "Cannot verify the token",
      });

    default:
      return res.status(403).json({
        message: err.message,
        errors: err.message,
      });
  }
}
