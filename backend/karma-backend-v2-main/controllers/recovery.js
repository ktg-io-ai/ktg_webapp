const crypto = require('crypto')
const logger = require('../logger')
const { buildError } = require('../utils/helpers')
const db = require('../models')
const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const config = require('../config/convict')
const { encryptPassword } = require('../utils/password')
const { validateResetPassword } = require('../validators/recovery')

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const email = req.body.email

  if (!email) {
    return next(new ErrorResponse('Please provide an email.', 400))
  }

  // Find the user
  const user = await db.User.findOne({ where: { email: email, isEmailVerified: true } })
  const userProfile = await db.UserProfile.findOne({
    where: {
      // email or username
      [db.sequelize.Op.or]: [{ email: email.toLowerCase() }, { profileName: email }],
    },
  })
  if (!user || !userProfile) {
    // This is an error, but we don't want to leak if the user exists or not
    return res.status(200).json({
      success: false,
      message: 'If your email is correct, password reset link will be sent to your email!',
      data: {},
    })
  }

  // Get reset token
  const resetPasswordToken = await crypto.randomBytes(64).toString('hex')
  const resetPasswordTokenExpiry = new Date(Date.now() + parseInt(config.get('recovery.tokenExpiry'), 10) * 60 * 1000)

  // Update user
  user.resetPasswordToken = resetPasswordToken
  user.resetPasswordExpiry = resetPasswordTokenExpiry
  user.updatedBy = userProfile.id
  await user.save()

  let resetLink = `${config.get('app_url')}/auth/reset-password/${resetPasswordToken}`
  try {
    let info
    // TODO: SEND AN EMAIL TO THE USER

    if (info?.messageId) {
      return res.status(200).json({
        success: true,
        message: 'If your email is correct, password reset link will be sent to your email!',
      })
    } else {
      logger.error(info || 'Undefined variable: info')
      return next(new ErrorResponse('Error sending email, please try again later.', 500))
    }
  } catch (err) {
    logger.error(err)

    user.resetPasswordToken = null
    user.resetPasswordExpiry = null
    user.updatedBy = userProfile.id
    await user.save()

    return next(new ErrorResponse('Error sending email, please try again later.', 500))
  }
})

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const token = req.params.token

  if (!token) {
    return next(new ErrorResponse('The password reset link might be expired!', 400))
  }

  const user = await db.User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiry: {
        [db.Sequelize.Op.gt]: new Date(),
      },
    },
  })

  if (!user) {
    return next(new ErrorResponse('The password reset link might be expired!', 403))
  }

  // Validate password
  const { error, value } = validateResetPassword(req.body)
  if (error) {
    return buildError(error, res, next)
  }

  // Encrypt password
  const password = await encryptPassword(value.password)

  // Set new password
  user.password = password
  user.resetPasswordToken = null
  user.resetPasswordExpiry = null
  user.updatedBy = user.userProfileId
  await user.save()

  res.status(200).json({
    success: true,
    message: 'Password has been reset, you may login now!',
    data: {},
  })
})
