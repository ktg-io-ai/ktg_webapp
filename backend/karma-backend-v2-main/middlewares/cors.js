const allowlist = ['http://127.0.0.1:3033', 'http://127.0.0.1:3031', 'http://localhost:3033', 'http://localhost:3031']

const corsOptions = (req, callback) => {
  var corsOptions
  let isKarmaDomain = false
  if (req?.headers?.origin?.includes('karmathegame.netlify.app')) {
    isKarmaDomain = true
  }

  if (allowlist.includes(req.headers.origin) || isKarmaDomain) {
    corsOptions = { origin: true } // Enable CORS
  } else {
    corsOptions = { origin: false } // Disable CORS
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

module.exports = corsOptions
