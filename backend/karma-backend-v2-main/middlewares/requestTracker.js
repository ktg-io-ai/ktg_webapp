const platform = require('platform')
const { RequestLog } = require('../models')
const logger = require('../logger')

module.exports = async (req, res, next) => {
  try {
    // IP ADDRESS
    const ipAddress = (
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
    ).split(',')[0]

    // CURRENT URL
    const url = req.originalUrl

    // REFERRAL URL
    const referral = req.headers.referer

    const userAgent = req.headers['user-agent']
    const info = platform.parse(userAgent)

    // OTHER INFO
    const name = info.name // 'Opera'
    const version = info.version // '11.52'
    const layout = info.layout // 'Presto'
    const os = info.os // 'Mac OS X 10.7.2'
    const description = info.description // 'Opera 11.52 (identifying as Firefox 4.0) on Mac OS X 10.7.2'

    // OTHER FIELD
    const otherInfo = {}
    otherInfo.os = os

    // SAVE REQUEST LOG
    const requestLog = await RequestLog.create({
      ipAddress,
      url,
      referral,
      uaName: name,
      uaVersion: version,
      uaOS: os.family,
      uaDescription: description,
      other: JSON.stringify(otherInfo),
      params: JSON.stringify(req.params),
      query: JSON.stringify(req.query),
      body: JSON.stringify({
        ...req.body,
        password: req?.body?.password ? null : undefined,
      }),
    })

    req.requestId = requestLog.id
    next()
  } catch (error) {
    logger.error(error)
    next()
  }
}
