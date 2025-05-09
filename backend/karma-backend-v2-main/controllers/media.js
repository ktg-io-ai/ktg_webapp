const fs = require('fs')
const { parse: pathParse, dirname } = require('path')
const sharp = require('sharp')
const config = require('../config/convict')
const asyncHandler = require('../middlewares/asyncHandler')
const { rollbackImage } = require('../middlewares/fileUpload')
const db = require('../models')
const ErrorResponse = require('../utils/errorResponse')
const im = require('imagemagick')
const { signMediaToken, verifyMediaToken } = require('../utils/jwt')
const filtering = require('../utils/filtering')
const { populateMedia } = require('../utils/populate')

async function saveMedia(req, res, next, isPrivate, isReturn) {
  if (!req.file) {
    return next(new ErrorResponse('No image provided!', 400))
  }

  let uploadPath = config.get('upload.image.path')
  if (isPrivate) {
    uploadPath = config.get('upload.image.privatePath')
  }
  const directoryPath = req.file.destination.replace(`${uploadPath}/`, '')
  const originalFilePathToBeSaved = directoryPath + req.file.filename

  // convert image to webp and retain the original image
  const fileExtension = pathParse(req.file.originalname).ext
  const fileNameWithoutExtension = req.file.filename.replace(/\.[^/.]+$/, '')
  const originalAbsoluteFilePath = uploadPath + '/' + originalFilePathToBeSaved
  const newFileAbsolutePath = uploadPath + '/' + directoryPath + fileNameWithoutExtension

  // Get size of an image
  let hasFileError = false
  let dimensions
  try {
    dimensions = await new Promise((resolve, reject) => {
      im.identify(originalAbsoluteFilePath, function (err, output) {
        if (err) {
          hasFileError = true
          reject(err)
        }

        try {
          dimensions = {
            width: output.width,
            height: output.height,
          }

          resolve(dimensions)
        } catch (error) {
          hasFileError = true
        }
      })
    })
  } catch (error) {
    hasFileError = true
  }

  let media
  if (hasFileError) {
    media = await db.Media.create({
      name: pathParse(req.file.originalname).name,
      originalFile: originalFilePathToBeSaved,
      originalMimeType: req.file.mimetype,
      originalSize: req.file.size,
      path: originalFilePathToBeSaved,
      mimeType: req.file.mimetype,
      size: req.file.size,
      isPrivate: isPrivate,
      sizes: [],

      createdBy: req?.user?.id || null,
      platform: req.body.platform || null,
    })

    if (!media) {
      rollbackImage(req.file.path)
      return next(new ErrorResponsee('Media could not be saved!', 409))
    }

    return media
  }

  // check if landscape or portrait
  const orientation = dimensions.width > dimensions.height ? 'landscape' : 'portrait'

  // Set max width or height based on orientation
  let maxWidth = orientation === 'landscape' && dimensions.width >= 1920 ? 1920 : dimensions.width
  let maxHeight = orientation === 'portrait' && dimensions.width >= 1080 ? 1080 : dimensions.width

  // Original but compressed version
  let newFileSize
  try {
    await sharp(originalAbsoluteFilePath, { animated: true, pages: -1, page: 0 })
      .resize(orientation === 'landscape' ? maxWidth : maxHeight)
      .toFile(newFileAbsolutePath + fileExtension)
    const { size: newFileSize } = fs.statSync(newFileAbsolutePath)
  } catch (error) {
    rollbackImage(newFileAbsolutePath)
  }

  let sizes = []

  // Generate 80x80 thumbnails using sharp
  if (dimensions.width > 80 || dimensions.height > 80) {
    try {
      await sharp(originalAbsoluteFilePath, { animated: true, pages: -1, page: 0 })
        .resize(80)
        .toFile(uploadPath + '/' + directoryPath + fileNameWithoutExtension + '-80x80' + fileExtension)
      sizes.push({ s80: '80x80' })
    } catch (error) {
      rollbackImage(uploadPath + '/' + directoryPath + fileNameWithoutExtension + '-80x80' + fileExtension)
    }
  }

  // Generate 150x150 thumbnails using sharp
  if (dimensions.width > 150 || dimensions.height > 150) {
    try {
      await sharp(originalAbsoluteFilePath, { animated: true, pages: -1, page: 0 })
        .resize(150)
        .toFile(uploadPath + '/' + directoryPath + fileNameWithoutExtension + '-150x150' + fileExtension)
      sizes.push({ s150: '150x150' })
    } catch (error) {
      rollbackImage(uploadPath + '/' + directoryPath + fileNameWithoutExtension + '-150x150' + fileExtension)
    }
  }

  // Generate 350x350 thumbnails using sharp
  if (dimensions.width > 350 || dimensions.height > 350) {
    try {
      await sharp(originalAbsoluteFilePath, { animated: true, pages: -1, page: 0 })
        .resize(350)
        .toFile(uploadPath + '/' + directoryPath + fileNameWithoutExtension + '-350x350' + fileExtension)
      sizes.push({ s350: '350x350' })
    } catch (error) {
      rollbackImage(uploadPath + '/' + directoryPath + fileNameWithoutExtension + '-350x350' + fileExtension)
    }
  }

  // Generate 1024x1024 thumbnails using sharp
  if (dimensions.width > 1024 || dimensions.height > 1024) {
    try {
      await sharp(originalAbsoluteFilePath, { animated: true, pages: -1, page: 0 })
        .resize(1024)
        .toFile(uploadPath + '/' + directoryPath + fileNameWithoutExtension + '-1024x1024' + fileExtension)
      sizes.push({ s1024: '1024x1024' })
    } catch (error) {
      rollbackImage(uploadPath + '/' + directoryPath + fileNameWithoutExtension + '-1024x1024' + fileExtension)
    }
  }

  if (!sizes.length) {
    media = await db.Media.create({
      name: pathParse(req.file.originalname).name,
      originalFile: originalFilePathToBeSaved,
      originalMimeType: req.file.mimetype,
      originalSize: req.file.size,
      path: originalFilePathToBeSaved,
      mimeType: req.file.mimetype,
      size: req.file.size,
      sizes: sizes,
      isPrivate: isPrivate,

      createdBy: req?.user?.id || null,
      platform: req.body.platform || null,
    })
  } else {
    media = await db.Media.create({
      name: pathParse(req.file.originalname).name,
      originalFile: originalFilePathToBeSaved,
      originalMimeType: req.file.mimetype,
      originalSize: req.file.size,
      path: directoryPath + fileNameWithoutExtension + fileExtension,
      mimeType: req.file.mimetype,
      size: newFileSize,
      sizes: sizes,
      isPrivate: isPrivate,

      createdBy: req?.user?.id || null,
      platform: req.body.platform || null,
    })
  }

  if (!media) {
    rollbackImage(req.file.path)
    return next(new ErrorResponsee('Media could not be saved!', 409))
  }

  media = await db.Media.findByPk(media.id, {
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
  })
  populateMedia([media])
  if (!isReturn) {
    res.status(201).json({
      success: true,
      message: 'Media saved successfully!',
      data: media,
    })
  } else {
    return media
  }
}

exports.saveUploadedMedia = asyncHandler(async (req, res, next) => {
  await saveMedia(req, res, next, false)
})

exports.saveAllUploadedMedia = asyncHandler(async (req, res, next) => {
  const files = req.files
  const filesToBeSaved = []

  if (!files?.length) {
    return next(new ErrorResponse('No image provided!', 400))
  }

  await files.reduce(async (promise, file) => {
    await promise
    req.file = file
    const image = await saveMedia(req, res, next, false, true)
    filesToBeSaved.push(image)
  }, Promise.resolve())

  populateMedia(filesToBeSaved)

  res.status(201).json({
    success: true,
    message: 'Images saved successfully!',
    data: filesToBeSaved,
  })
})

exports.saveUploadedPrivateMedia = asyncHandler(async (req, res, next) => {
  saveMedia(req, res, next, true)
})

exports.saveAllUploadedPrivateMedia = asyncHandler(async (req, res, next) => {
  const files = req.files
  const filesToBeSaved = []

  if (!files?.length) {
    return next(new ErrorResponse('No image provided!', 400))
  }

  await files.reduce(async (promise, file) => {
    await promise
    req.file = file
    const image = await saveMedia(req, res, next, true, true)
    filesToBeSaved.push(image)
  }, Promise.resolve())

  populateMedia(filesToBeSaved)

  res.status(201).json({
    success: true,
    message: 'Images saved successfully!',
    data: filesToBeSaved,
  })
})

exports.viewPrivateMedia = asyncHandler(async (req, res, next) => {
  const mediaToken = req.params.mediaToken
  let decoded
  try {
    decoded = verifyMediaToken(mediaToken)
    if (!decoded) {
      return next(new ErrorResponse("You don't have a permission to access this resource!", 403))
    }
  } catch (error) {
    return next(new ErrorResponse('Invalid signature!', 403))
  }

  let mediaId
  if (decoded && decoded.mediaId) {
    mediaId = decoded.mediaId
  } else {
    return next(new ErrorResponse("You don't have a permission to access this resource!", 403))
  }

  const media = await db.Media.findOne({
    where: {
      id: mediaId,
      isPrivate: true,
    },
  })
  if (!media) {
    return next(new ErrorResponse('Media not found!', 404))
  }

  if (decoded.size) {
    const extension = pathParse(media.path).ext
    const fileName = pathParse(media.path).name
    const folderPath = pathParse(media.path).dir

    let privateMediaPath = `${config.get('upload.image.privatePath').replace('./', '')}/${folderPath}/${fileName}-${
      decoded.size
    }${extension}`
    privateMediaPath = privateMediaPath.startsWith('/', 0) ? privateMediaPath.substring(1) : privateMediaPath
    let absPrivatePath = `${dirname(require.main.filename)}/${privateMediaPath}`

    if (!fs.existsSync(absPrivatePath)) {
      return next(new ErrorResponse('Media not found!', 404))
    }

    res.sendFile(absPrivatePath)
  } else {
    // view media using mimetype
    let mediaPath = `${config.get('upload.image.privatePath')}/${media.path}`.replace('./', '')
    mediaPath = mediaPath.startsWith('/', 0) ? mediaPath.substring(1) : mediaPath
    let absPath = `${dirname(require.main.filename)}/${mediaPath}`

    if (!fs.existsSync(absPath)) {
      return next(new ErrorResponse('Media not found!', 404))
    }

    res.sendFile(absPath)
  }
})

exports.signPrivateMedia = asyncHandler(async (req, res, next) => {
  const mediaId = req.params.mediaId
  const media = await db.Media.findOne({
    where: {
      id: mediaId,
      isPrivate: true,
    },
  })

  // Check if media exists
  if (!media) {
    return next(new ErrorResponse('Media not found!', 404))
  }

  // check if current user is admin, or a media owner
  if (req?.user?.role !== 'SUPER_ADMIN' && req?.user?.id !== media.createdBy) {
    return next(new ErrorResponse('You are not authorized to view this media!', 403))
  }

  // Generate media access token for 15 minutes
  const mediaAccessToken = signMediaToken({ mediaId })

  res.status(200).json({
    success: true,
    message: 'Media access token generated successfully!',
    data: `${config.get('cdn_url')}/media/${mediaAccessToken}`,
  })
})

exports.getAllMedia = asyncHandler(async (req, res, next) => {
  const options = {
    model: db.Media,
    db: db,
    searchQuery: req.query.search || false,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'asc',
    searchFields: ['name'],
    suParanoid: true,
    excludeFields: [
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
  }

  await filtering(options, req, res, next)
  populateMedia(res.filtered.rows)

  res.status(200).json({
    success: true,
    message: 'All media.',
    data: res.filtered,
  })
})
