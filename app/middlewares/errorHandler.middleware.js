const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  res.status(error.status || 500).json({ message: error.message });
};

export default errorHandler;