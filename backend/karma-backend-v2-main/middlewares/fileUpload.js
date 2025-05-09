const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const config = require('../config/convict')
const fs = require('fs')

const publicUploadPath = config.get('upload.image.path') + '/'
const privateUploadPath = config.get('upload.image.privatePath') + '/'

const supportedImageFiles = config.get('upload.image.allowedTypes')

const validateFiles = function (req, file, cb, allowedTypes, errorMsg) {
  allowedTypes = new RegExp(allowedTypes.join('|'))

  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())

  // Mimetype checking needs to be disabled because of *.bundle file
  const mimetype = allowedTypes.test(file.mimetype)

  // if (mimetype && extname) {
  if (extname) {
    return cb(null, true)
  } else {
    cb(new ErrorResponse(errorMsg, 500))
  }
}

const fileFilter = function (req, file, cb, allowedTypes) {
  validateFiles(req, file, cb, allowedTypes, `Supported files are ${allowedTypes.join(', ')}!`)
}

exports.fileUploadConfig = (req, res, next) => {
  const yearFolder = new Date().getFullYear()
  const monthFolder = new Date().getMonth() + 1 // 0 to 11 months (0 is January)
  const dateFolder = new Date().getDate()

  // Create folder for the year
  if (!fs.existsSync(publicUploadPath + yearFolder)) {
    fs.mkdirSync(publicUploadPath + yearFolder)
  }
  if (!fs.existsSync(privateUploadPath + yearFolder)) {
    fs.mkdirSync(privateUploadPath + yearFolder)
  }

  // Create folder for the month
  if (!fs.existsSync(publicUploadPath + yearFolder + '/' + monthFolder)) {
    fs.mkdirSync(publicUploadPath + yearFolder + '/' + monthFolder)
  }
  if (!fs.existsSync(privateUploadPath + yearFolder + '/' + monthFolder)) {
    fs.mkdirSync(privateUploadPath + yearFolder + '/' + monthFolder)
  }

  // Create folder for the date
  if (!fs.existsSync(publicUploadPath + yearFolder + '/' + monthFolder + '/' + dateFolder)) {
    fs.mkdirSync(publicUploadPath + yearFolder + '/' + monthFolder + '/' + dateFolder)
  }

  if (!fs.existsSync(privateUploadPath + yearFolder + '/' + monthFolder + '/' + dateFolder)) {
    fs.mkdirSync(privateUploadPath + yearFolder + '/' + monthFolder + '/' + dateFolder)
  }

  req.currentYear = yearFolder
  req.currentMonth = monthFolder
  req.currentDate = dateFolder
  next()
}

function getDatePath(date) {
  return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '/'
}

// Upload Image in public upload directory
exports.uploadImage = (validTypes = supportedImageFiles) => {
  return multer({
    limits: { fileSize: config.get('upload.image.size') },
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, publicUploadPath + getDatePath(new Date()))
      },
      filename: function (req, file, cb) {
        cb(null, uuidv4() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
      },
    }),
    fileFilter: (req, file, cb) => fileFilter(req, file, cb, validTypes),
  }).single('file')
}

exports.uploadImages = multer({
  limits: { fileSize: config.get('upload.image.size') },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, publicUploadPath + getDatePath(new Date()))
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    },
  }),
  fileFilter: (req, file, cb) => fileFilter(req, file, cb, supportedImageFiles),
}).array('files', 12)

// Upload image in private upload directory
exports.uploadPrivateImage = (validTypes = supportedImageFiles) => {
  return multer({
    limits: { fileSize: config.get('upload.image.size') },
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, privateUploadPath + getDatePath(new Date()))
      },
      filename: function (req, file, cb) {
        cb(null, uuidv4() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
      },
    }),
    fileFilter: (req, file, cb) => fileFilter(req, file, cb, validTypes),
  }).single('file')
}

exports.uploadPrivateImages = multer({
  limits: { fileSize: config.get('upload.image.size') },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, privateUploadPath + getDatePath(new Date()))
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    },
  }),
  fileFilter: (req, file, cb) => fileFilter(req, file, cb, supportedImageFiles),
}).array('files', 12)

exports.uploadCSV = (validTypes = ['csv']) => {
  return multer({
    limits: { fileSize: config.get('upload.image.size') },
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, privateUploadPath + getDatePath(new Date()))
      },
      filename: function (req, file, cb) {
        cb(null, uuidv4() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
      },
    }),
    fileFilter: (req, file, cb) => fileFilter(req, file, cb, validTypes),
  }).single('csv')
}

const supportedFaviconFiles = config.get('upload.favicon.allowedTypes')
const faviconPath = config.get('upload.favicon.path')
exports.uploadFavicon = multer({
  limits: { fileSize: config.get('upload.image.size') },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, faviconPath)
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    },
  }),
  fileFilter: (req, file, cb) => fileFilter(req, file, cb, supportedFaviconFiles),
})

// Remove image by it's name (e.g.: rollbackImage(req.uploadedPath + req.file.filename))
exports.rollbackImage = (file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
  }
}

/**
 * This will allow you to pass data via multipart/form-data.
 * Only call this middleware when there is no file upload in the routes.
 */
exports.allowTexts = multer().none()
