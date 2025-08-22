const errorHandler = (err, req, res, next) => {
  const requestId = req.headers['x-request-id'] || Date.now().toString();
  
  console.error(`[${requestId}] Error:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  let errorResponse = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      requestId: requestId
    }
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.details = err.stack;
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;