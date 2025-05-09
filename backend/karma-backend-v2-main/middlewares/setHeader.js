const setHeader = (res, next) => {
  // res.setHeader(
  //   'Content-Security-Policy',
  //   "script-src 'self' * 'unsafe-inline';" + "font-src 'self' * 'unsafe-inline';"
  // )
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none')
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none')
  return next()
}
module.exports = setHeader
