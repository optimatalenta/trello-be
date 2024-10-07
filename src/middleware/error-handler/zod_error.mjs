export function zodErrorHandler(err, res) {
  res.status(422).json({
    message: "Validation error",
    errors: [
      err.issues.map((e) => {
        return { [e.path[0]]: e.message };
      }),
    ],
  });
}
