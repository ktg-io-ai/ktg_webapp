const asyncHandler = require('../middlewares/asyncHandler')
const filtering = require('../utils/filtering')
const db = require('../models')

exports.getAllGroups = asyncHandler(async (req, res, next) => {
  const options = {
    model: db.Group,
    db: db,
    searchQuery: req.query.search || false,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'asc',
    searchFields: ['name', 'color'],
    suParanoid: true,
    excludeFields: ['createdAt', 'updatedAt', 'deletedAt', 'platform', 'createdBy', 'updatedBy'],
  }

  await filtering(options, req, res, next)

  res.status(200).json({
    success: true,
    message: 'All groups.',
    data: res.filtered,
  })
})
