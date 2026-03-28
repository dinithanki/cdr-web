// /middleware/errorMiddleware.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error for debugging

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};
