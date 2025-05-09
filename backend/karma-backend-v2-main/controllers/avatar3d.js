const asyncHandler = require('../middlewares/asyncHandler')
const db = require('../models')
const ErrorResponse = require('../utils/errorResponse')
const filtering = require('../utils/filtering')
const { isValidUUID } = require('../utils/helpers')
const { populateMedia } = require('../utils/populate')

exports.getAllAvatar3Ds = asyncHandler(async (req, res, next) => {
  let condition = {}
  let filter = req.query

  if (filter?.group) {
    if (!isValidUUID(filter.group)) {
      return next(new ErrorResponse(`Group is invalid, please choose the valid one.`, 400))
    }
    condition.groupId = filter.group
  }

  if (filter?.user) {
    if (!isValidUUID(filter.user)) {
      return next(new ErrorResponse(`User is invalid, please choose the valid one.`, 400));
    }
    condition.createdBy = filter.user;
  }

  const options = {
    model: db.Avatar3D,
    db: db,
    searchQuery: req.query.search || false,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'asc',
    searchFields: ['name'],
    suParanoid: true,
    condition: condition,
    excludeFields: ['createdAt', 'updatedAt', 'deletedAt', 'platform', 'createdBy', 'updatedBy', 'groupId'],
    include: [
      {
        model: db.Group,
        as: 'group',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'platform', 'createdBy', 'updatedBy'] },
      },
      {
        model: db.Media,
        as: 'avatarPhoto',
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
            'deletedAt',
            'platform',
            'createdBy',
            'updatedBy',
            'isBase64',
            'originalFile',
            'originalMimeType',
            'originalSize',
            'mimeType',
            'size',
          ],
        },
      },
    ],
  }

  await filtering(options, req, res, next)
  populateMedia(res.filtered.rows, 'avatarPhoto')

  res.status(200).json({
    success: true,
    message: 'All 2D avatars.',
    data: res.filtered,
  })
});

exports.createAvatar3D = asyncHandler(async (req, res, next) => {
  const { name, avatar2D, platform } = req.body;
  const userId = req.user.id;

  const avatar3D = await db.Avatar3D.create({
    name,
    avatar2D,
    platform,
    createdBy: userId,
    updatedBy: userId,
  });

  res.status(201).json({
    success: true,
    message: '2D avatar created successfully.',
    data: avatar3D,
  });
});

exports.updateAvatar3D = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, avatar2D, platform } = req.body;
  const userId = req.user.id;

  let avatar3D = await db.Avatar3D.findByPk(id);

  if (!avatar3D) {
    return next(new ErrorResponse(`Avatar not found with id of ${id}`, 404));
  }

  await avatar3D.update({
    name,
    avatar2D,
    platform,
    updatedBy: userId,
  });

  res.status(200).json({
    success: true,
    message: '2D avatar updated successfully.',
    data: avatar3D,
  });
});

exports.deleteAvatar3D = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let avatar3D = await db.Avatar3D.findByPk(id);

  if (!avatar3D) {
    return next(new ErrorResponse(`Avatar not found with id of ${id}`, 404));
  }

  await avatar3D.destroy();

  res.status(200).json({
    success: true,
    message: '2D avatar deleted successfully.',
    data: {},
  });
});
