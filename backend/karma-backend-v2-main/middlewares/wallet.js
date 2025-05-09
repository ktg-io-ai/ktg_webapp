const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('./asyncHandler')

exports.isZappedOrTerminated = asyncHandler(async (req, res, next) => {
  // When profile is terminated
  if (req?.user?.wallet && req?.user?.wallet?.isTerminated == true) {
    return next(new ErrorResponse('Your account is terminated.', 403))
  }

  // When profile is zapped
  if (req?.user?.wallet && req?.user?.wallet?.isZapped == true) {
    return next(new ErrorResponse('Your account is terminated.', 403))
  }

  // When days are greater than expiresIn
  if (req?.user?.wallet && req?.user?.wallet?.days > req?.user?.wallet?.expiresIn) {
    return next(new ErrorResponse('Your token is expired, please purchase a new one or apply an existing one.', 403))
  }
  next()
})
