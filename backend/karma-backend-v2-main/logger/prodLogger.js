const path = require('path')
const { format, createLogger, transports } = require('winston')
const { timestamp, combine, colorize, errors, json } = format

const buildProdLogger = () => {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: 'user-service' },
    transports: [new transports.Console(), new transports.File({ filename: path.join(__dirname, `../logs/logs`) })],
  })
}

module.exports = buildProdLogger
