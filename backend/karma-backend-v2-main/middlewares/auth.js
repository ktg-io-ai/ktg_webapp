const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const { verifyToken, verifyRefreshToken } = require('../utils/jwt')
const logger = require('../logger')
const db = require('../models')
const { walletData } = require('../utils/wallet')

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token, refreshToken

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.token) {
    token = req.cookies.token
  }

  if (req.headers.refreshtoken) {
    refreshToken = req.headers.refreshtoken
  } else if (req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken
  }

  //  Make sure token exists
  if (!token) {
    return next(new ErrorResponse('You do not have permission to access this resource.', 403))
  }

  // Make sure refreshToken exists
  if (!refreshToken) {
    return next(new ErrorResponse('You do not have permission to access this resource.', 403))
  }

  // Check if token is present in the database
  const isAccessTokenInDB = await db.AccessToken.findOne({ where: { token: token } })

  // Check if refreshToken is present in the database
  const isRefreshTokenInDB = await db.RefreshToken.findOne({ where: { token: refreshToken } })

  if (!isAccessTokenInDB || !isRefreshTokenInDB) {
    return next(new ErrorResponse('You do not have permission to access this resource.', 403))
  }

  // Check if token expired
  let decoded, refreshTokenDecoded

  try {
    decoded = verifyToken(token)
    if (!decoded || !decoded.id) {
      return next(new ErrorResponse('You do not have permission to access this resource.', 401))
    }
  } catch (error) {
    return next(new ErrorResponse('Your session is expired, you need to login again!', 401))
  }

  try {
    refreshTokenDecoded = verifyRefreshToken(refreshToken)
    if (!refreshTokenDecoded || !refreshTokenDecoded.id) {
      return next(new ErrorResponse('You do not have permission to access this resource.', 403))
    }
  } catch (error) {
    return next(new ErrorResponse('Your session is expired, you need to login again!', 403))
  }

  // find user
  try {
    const sessionUser = await db.UserProfile.findOne({ where: { id: decoded.id } })
    req.user = sessionUser

    // update request log by req.requestId
    if (req.requestId) {
      await db.RequestLog.update(
        {
          userProfileId: sessionUser.id,
        },
        {
          where: { id: req.requestId },
        }
      )
    }

    // TODO: Wallet data should be fetched from the database
    const wallet = await walletData(req.user)
    req.user.wallet = wallet

    return next()
  } catch (err) {
    logger.error(err)
    return next(new ErrorResponse('You do not have permission to access this resource.', 403))
  }
})

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.roles)) {
        return next(new ErrorResponse('You do not have permission to access this resource.', 403))
      }
    } catch (error) {
      return next(new ErrorResponse('You do not have permission to access this resource.', 403))
    }
    return next()
  }
}
