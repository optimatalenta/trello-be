export function prismaErrorHandler(err, res) {
  switch (err.code) {
    case "P2002":
      return res.status(409).json({
        message: "Unique Constraint",
        error: err.meta,
      });

    case "P2003":
      return res.status(400).json({
        error: "Foreign key constraint failed.",
      });

    default:
      return res.status(500).json({
        error: "An unknown database error occurred.",
      });
  }
}

export function prismaUnknownErrorHandler(err, res) {
  return res.status(500).json({
    error: "An unknown error occurred while processing your request.",
  });
}

export function prismaValidationErrorHandler(err, res) {
  return res.status(400).json({
    error: "Validation failed for the query.",
  });
}

export function prismaInitializationErrorHandler(err, res) {
  return res.status(500).json({
    error: "Failed to initialize database connection.",
  });
}

export function prismaRustPanicErrorHandler(err, res) {
  return res.status(500).json({
    error: "A severe error occurred in the database engine.",
  });
}
