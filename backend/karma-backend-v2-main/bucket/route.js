const express = require('express')
const { viewPrivateMedia } = require('../controllers/media')
const router = express.Router()

router.route('/media/:mediaToken').get(viewPrivateMedia)

module.exports = router
