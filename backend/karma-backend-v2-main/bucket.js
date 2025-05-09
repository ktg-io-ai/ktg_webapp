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
const requestTracker = require('./middlewares/requestTracker')
const bucketRoute = require('./bucket/route')

const app = express()

// Body parser
app.use(
  express.json({
    limit: '102mb',
  })
)

// Only works when content-type is set to x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
    limit: '102mb',
  })
)

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
  max: 500, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

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
app.use(express.static(path.join(__dirname, 'bucket/public')))

// TRACK REQUEST
app.use(requestTracker)

// Mount routers
app.use('/', bucketRoute)

// Custom Error Handler
app.use(errorHandler)

// Start the server
app.listen(
  config.get('cdnPort'),
  logger.info(`Bucket server running in ${config.get('env')} mode on port ${config.get('cdnPort')}`)
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Rejection: ' + err.message)
})
