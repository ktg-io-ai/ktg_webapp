const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

const logger = require('./logger')
const errorHandler = require('./middlewares/error')
const config = require('./config/convict')
const { fileUploadConfig } = require('./middlewares/fileUpload')
const requestTracker = require('./middlewares/requestTracker')
const expressListRoutes = require('./utils/express-list-routes');

// Import route Files
const authRoute = require('./routes/auth')
const recoveryRoute = require('./routes/recovery')
const mediaRoute = require('./routes/media')
const groupRoute = require('./routes/group')
const avatar3dRoute = require('./routes/avatar3d')
const ambassadorCodeRoute = require('./routes/ambassadorCode')
const emojiRoute = require('./routes/emoji');

const app = express()

// Body parser
app.use(express.json({ limit: '102mb' }))

// Only works when content-type is set to x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '102mb' }))

// Cookie parser
app.use(cookieParser())

// Sanitize data

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 means one minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(
  cors(function (req, callback) {
    require('./middlewares/cors')(req, callback)
  })
)

app.use(function (req, res, next) {
  require('./middlewares/setHeader')(res, next)
})

// Set static folder

// Custom image upload directory settings middleware
app.use(fileUploadConfig)

// TRACK REQUEST
app.use(requestTracker)

// Mount routers
app.use('/api/v2/', authRoute)
app.use('/api/v2/', recoveryRoute)
app.use('/api/v2/', mediaRoute)
app.use('/api/v2/', groupRoute)
app.use('/api/v2/', avatar3dRoute);
app.use('/api/v2/', ambassadorCodeRoute);
app.use('/api/v2/', emojiRoute);

// Custom Error Handler
app.use(errorHandler);

// Log all routes
if (config.get('env') === 'development') {
  const allRoutes = expressListRoutes(app);
  console.log(allRoutes);
}

// Get all routes
if (config.get('env') === 'development') {
  const fs = require('fs')
  const expressListRoutes = require('./utils/express-list-routes')
  const allRoutes = expressListRoutes(app)

  fs.writeFile('./routes-list.js', JSON.stringify(allRoutes), 'utf8', function (err) {
    if (err) {
      logger.error('Error occured while saving routes file.')
    }
    logger.info('Routes file saved successfully.')
  })
}

// Start the server
app.listen(config.get('port'), logger.info(`Server running in ${config.get('env')} mode on port ${config.get('port')}`))

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(err)
  logger.error('Unhandled Rejection: ' + err.message)
})
