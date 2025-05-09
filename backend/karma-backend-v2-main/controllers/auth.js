const asyncHandler = require('../middlewares/asyncHandler')
const { validateLogin, validateRegister, validateReCreateProfile } = require('../validators/auth')
const { buildError } = require('../utils/helpers')
const { validatePassword, encryptPassword } = require('../utils/password')
const db = require('../models')
const { authCookieOptions, signToken, signRefreshToken } = require('../utils/jwt')
const ErrorResponse = require('../utils/errorResponse')
const logger = require('../logger')
const { isResourceExist } = require('../utils/dbHelpers')
const { populateMedia } = require('../utils/populate')
const { walletData, applyDefaultToken, amIZapped, restoreProfile } = require('../utils/wallet')

// MOBILE REGISTRATION FLOW, ROLE WILL ALWAYS BE PLAYER
exports.register = asyncHandler(async (req, res, next) => {
  const { error, value } = validateRegister(req.body)
  if (error) {
    return buildError(error, res, next)
  }
  const password = await encryptPassword(value.password)

  // Check if avatar3D exists in the database
  let avatar3D = await isResourceExist(db.Avatar3D, { column: 'id', value: value.avatar3D })
  if (!avatar3D) {
    return next(new ErrorResponse('Avatar is required, please select a valid one.', 400))
  }

  // Check if ambassadorCode exists in the database
  let ambassadorUserId = null
  if (value.ambassadorCode) {
    ambassadorCode = await isResourceExist(db.ambassadorCode, { column: 'code', value: value.ambassadorCode })
    if (!ambassadorCode) {
      return next(new ErrorResponse('Ambassador code is invalid.', 400))
    }
    ambassadorUserId = ambassadorCode.ambassadorId
  }

  // begin transaction
  let user, userProfile
  const transaction = await db.sequelize.transaction()
  try {
    userProfile = await db.UserProfile.create(
      {
        avatar3D: value.avatar3D,
        ambassadorUserId: ambassadorUserId,
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        profileName: value.profileName,
        tos: value.tos == 'true' ? true : false,
        tagline: value.tagline || null,
        platform: value.platform,
      },
      { transaction }
    )
    user = await db.User.create(
      {
        userProfileId: userProfile.id,
        email: value.email,
        password: password,

        platform: value.platform,
        createdBy: userProfile.id,
      },
      {
        transaction,
      }
    )
  } catch (error) {
    await transaction.rollback()
    if (error?.original?.code == 23505) {
      return next(new ErrorResponse('User is already exist.', 400))
    } else {
      logger.error(error)
      return next(new ErrorResponse('something went wrong, please try again later.', 500))
    }
  }

  // Apply default token
  const isTokenApplied = await applyDefaultToken(userProfile, { transaction })
  if (!isTokenApplied) {
    await transaction.rollback()
    return next(new ErrorResponse('Something went wrong, please try again later.', 500))
  }

  await transaction.commit()

  // TODO: Send welcome email with email verification link, if necessary.

  const newUserProfile = await db.UserProfile.findOne({
    where: { id: userProfile.id },
    attributes: {
      exclude: [
        'avatar3D',
        'platform',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'ambassadorUserId',
      ],
    },
    include: [
      {
        model: db.UserProfile,
        as: 'ambassador',
        attributes: ['firstName', 'lastName', 'email', 'profileName'],
      },
      {
        model: db.Avatar3D,
        as: 'avatar',
        attributes: {
          exclude: ['groupId', 'avatar2D', 'platform', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'deletedAt'],
        },
        include: [
          {
            model: db.Group,
            as: 'group',
            attributes: {
              exclude: ['platform', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: db.Media,
            as: 'avatarPhoto',
            attributes: {
              exclude: [
                'isBase64',
                'originalFile',
                'originalMimeType',
                'originalSize',
                'mimeType',
                'size',
                'createdAt',
                'updatedAt',
                'deletedAt',
                'platform',
                'createdBy',
                'updatedBy',
              ],
            },
          },
        ],
      },
    ],
  })
  populateMedia([newUserProfile], 'avatar.avatarPhoto')

  const wallet = walletData(userProfile)
  newUserProfile.dataValues.wallet = wallet

  res.status(201).json({
    success: true,
    message: 'Thank you for registering with us.',
    data: newUserProfile,
  })
})

// MOBILE LOGIN API
exports.login = asyncHandler(async (req, res, next) => {
  const { error, value } = validateLogin(req.body)
  if (error) {
    return buildError(error, res, next)
  }

  value.email = value.email.trim()
  const userProfile = await db.UserProfile.findOne({
    where: {
      [db.Sequelize.Op.or]: [{ email: value?.email?.toLowerCase() }, { profileName: value.email }],
    },
    include: [
      {
        model: db.User,
        as: 'user',
        // where: {
        //   isEmailVerified: false, // TODO: Email verification email
        // },
      },
    ],
  })

  if (!userProfile) {
    return next(new ErrorResponse('Invalid login credentials.', 403))
  }

  const user = userProfile.user // WARNING: DON'T SHARE THIS VARIABLE IN RESPONSE
  delete userProfile.dataValues.user // WARNING: DON'T REMOVE THIS LINE

  const isValid = await validatePassword(value.password, user?.password)
  if (!isValid) {
    return next(new ErrorResponse('Invalid login credentials.', 403))
  }

  // Sign the token
  const token = signToken({ id: userProfile.id })
  const refreshToken = signRefreshToken({ id: userProfile.id })
  await db.AccessToken.create({
    token: token,
    userProfileId: userProfile.id,

    createdBy: userProfile.id,
    platform: value.platform,
  })
  await db.RefreshToken.create({
    token: refreshToken,
    userProfileId: userProfile.id,

    createdBy: userProfile.id,
    platform: value.platform,
  })

  if (req.requestId) {
    const requestLog = await db.RequestLog.findOne({
      where: { id: req.requestId },
    })
    requestLog.userProfileId = userProfile.id
    await requestLog.save()
  }

  const myProfile = await db.UserProfile.findOne({
    where: { id: userProfile.id },
    attributes: {
      exclude: [
        'avatar3D',
        'platform',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'ambassadorUserId',
      ],
    },
    include: [
      {
        model: db.UserProfile,
        as: 'ambassador',
        attributes: ['firstName', 'lastName', 'email', 'profileName'],
      },
      {
        model: db.Avatar3D,
        as: 'avatar',
        attributes: {
          exclude: ['groupId', 'avatar2D', 'platform', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'deletedAt'],
        },
        include: [
          {
            model: db.Group,
            as: 'group',
            attributes: {
              exclude: ['platform', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: db.Media,
            as: 'avatarPhoto',
            attributes: {
              exclude: [
                'isBase64',
                'originalFile',
                'originalMimeType',
                'originalSize',
                'mimeType',
                'size',
                'createdAt',
                'updatedAt',
                'deletedAt',
                'platform',
                'createdBy',
                'updatedBy',
              ],
            },
          },
        ],
      },
    ],
  })

  populateMedia([myProfile], 'avatar.avatarPhoto')

  const wallet = await walletData(myProfile)
  myProfile.dataValues.wallet = wallet

  res
    .status(200)
    .cookie('token', token, authCookieOptions)
    .cookie('refreshToken', refreshToken, authCookieOptions)
    .json({
      success: true,
      message: 'Login successful!',
      data: myProfile,
      token: token,
      refreshToken: refreshToken,
    })
})

exports.me = asyncHandler(async (req, res, next) => {
  const userProfile = await db.UserProfile.findOne({
    where: { id: req.user.id },
    attributes: {
      exclude: [
        'avatar3D',
        'platform',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'ambassadorUserId',
      ],
    },
    include: [
      {
        model: db.UserProfile,
        as: 'ambassador',
        attributes: ['firstName', 'lastName', 'email', 'profileName'],
      },
      {
        model: db.Avatar3D,
        as: 'avatar',
        attributes: {
          exclude: ['groupId', 'avatar2D', 'platform', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'deletedAt'],
        },
        include: [
          {
            model: db.Group,
            as: 'group',
            attributes: {
              exclude: ['platform', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: db.Media,
            as: 'avatarPhoto',
            attributes: {
              exclude: [
                'isBase64',
                'originalFile',
                'originalMimeType',
                'originalSize',
                'mimeType',
                'size',
                'createdAt',
                'updatedAt',
                'deletedAt',
                'platform',
                'createdBy',
                'updatedBy',
              ],
            },
          },
        ],
      },
    ],
  })

  if (!userProfile) return next(new ErrorResponse('You do not have permission to access this resource.', 403))

  populateMedia([userProfile], 'avatar.avatarPhoto')
  if (req?.user?.wallet) userProfile.dataValues.wallet = req.user.wallet
  res.status(200).json({
    success: true,
    message: 'My Profile!',
    data: userProfile,
  })
})

exports.createProfile = asyncHandler(async (req, res, next) => {
  const isZappedOrTerminated =
    (req?.user?.wallet && req?.user?.wallet?.isTerminated == true) ||
    (req?.user?.wallet && req?.user?.wallet?.isZapped == true)
  if (!isZappedOrTerminated) {
    return next(new ErrorResponse('You do not have permission to access this resource.', 403))
  }

  if (req.user.profileName === req.body.profileName) {
    return next(new ErrorResponse('Profile name is already exist.', 400))
  }

  const { error, value } = validateReCreateProfile(req.body)
  if (error) {
    return buildError(error, res, next)
  }

  let userProfile
  const transaction = await db.sequelize.transaction()
  try {
    userProfile = await db.UserProfile.findByPk(req.user.id)
    await userProfile.update(
      {
        profileName: value.profileName,
      },
      {
        transaction,
      }
    )
  } catch (error) {
    await transaction.rollback()
    if (error?.original?.code == 23505) {
      return next(new ErrorResponse('Profile name is already exist.', 400))
    } else {
      logger.error(error)
      return next(new ErrorResponse('something went wrong, please try again later.', 500))
    }
  }

  // Restore terminated account
  const isRestored = await restoreProfile(userProfile, { transaction })
  if (!isRestored) {
    await transaction.rollback()
    return next(new ErrorResponse('something went wrong, please try again later.', 500))
  }
  await transaction.commit()

  res.status(200).json({
    success: true,
    message: 'Profile restored successfully!',
    data: {},
  })
})
