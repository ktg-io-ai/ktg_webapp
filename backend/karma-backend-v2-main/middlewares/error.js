const logger = require('../logger')

const errorHandler = (err, req, res, next) => {
  console.log(err)
  let error = { ...err }

  error.message = err.message

  // Log to console for dev
  logger.error(err)
  console.log(err)

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
  })
}

module.exports = errorHandler
