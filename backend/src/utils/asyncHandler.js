/**
 * Wraps an async controller or middleware function.
 *
 * Any thrown error or rejected promise is automatically
 * forwarded to Express's global error handler via next().
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
