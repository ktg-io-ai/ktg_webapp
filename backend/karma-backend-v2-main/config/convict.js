const path = require('path')
const convict = require('convict')
require('dotenv').config()
const cdnURL = process.env.CDN_URL

const config = convict({
  env: {
    doc: 'The application environments.',
    format: ['production', 'development', 'staging'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 2222,
    env: 'PORT',
    arg: 'port',
  },
  cdnPort: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3333,
    arg: 'cdnPort',
  },
  app_name: {
    doc: 'The application name.',
    format: String,
    default: 'Karma The Game',
  },
  app_url: {
    doc: 'Application URL for loading static assets',
    format: String,
    default: 'http://127.0.0.1:2222',
  },
  cdn_url: {
    doc: 'Application URL for loading assets over CDN',
    format: String,
    default: cdnURL,
  },
  app_utc_offset: {
    doc: 'Application timezone',
    format: String,
    default: '+05:30',
  },
  upload: {
    image: {
      path: './bucket/public',
      privatePath: './bucket/private',
      size: 2000000 * 50, // FIXME: reduce the size
      allowedTypes: ['png', 'jpg', 'jpeg', 'gif', 'heic', 'jfif', 'avif', 'dat'],
    },
    favicon: {
      path: './bucket/public/favicon',
      size: 1000000 / 2, // in bytes
      allowedTypes: ['jpg', 'jpeg', 'png', 'ico', 'svg'],
    },
  },
  smtp: {
    doc: 'Configuration for Email',
    format: Object,
    default: {},
  },
  recovery: {
    tokenExpiry: 10, // in minutes
  },
  front: {
    doc: 'Frontend settings',
    format: Object,
    default: {},
  },
})

const env = config.get('env')
config.loadFile(path.join(__dirname, `config-${env}.json`)).validate()

// config.validate({ allowed: 'warn' })
module.exports = config
