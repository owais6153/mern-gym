// Error handling middleware
const ErrorMiddleware = (error, req, res, next) => {
  const status = error.statusCode || 500; // default value of error will be 500
  const message = error.message; //This property exist and it holds the msg you passed to the constructor of the error object
  res.status(status).json({ message: message });
};
export default ErrorMiddleware;
