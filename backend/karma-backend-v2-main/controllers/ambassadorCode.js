const asyncHandler = require('../middlewares/asyncHandler')
const db = require('../models')
const filtering = require('../utils/filtering')

exports.getAllAmbassadorCodes = asyncHandler(async (req, res, next) => {
  const options = {
    model: db.AmbassadorCode,
    db: db,
    searchQuery: req.query.search || false,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'asc',
    searchFields: ['name', 'color'],
    suParanoid: true,
    excludeFields: ['createdAt', 'updatedAt', 'deletedAt', 'platform', 'createdBy', 'updatedBy', 'ambassadorId'],
    include: [
      {
        model: db.UserProfile,
        as: 'ambassador',
        attributes: ['firstName', 'lastName', 'email', 'profileName'],
      },
    ],
  }

  await filtering(options, req, res, next)

  res.status(200).json({
    success: true,
    message: 'All ambassador codes.',
    data: res.filtered,
  })
})
