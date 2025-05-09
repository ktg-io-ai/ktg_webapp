const config = require('../config/convict')
const buildDevLogger = require('./devLogger')
const buildProdLogger = require('./prodLogger')

let logger = null

if (config.get('env') === 'development') {
  logger = buildDevLogger()
} else {
  logger = buildProdLogger()
}

module.exports = logger
