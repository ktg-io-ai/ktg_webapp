const asyncHandler = require('../middlewares/asyncHandler');

exports.getAllEmojis = asyncHandler(async (req, res, next) => {
  const emojis = ['😀', '😂', '😍', '🤔', '😎', '😭', '😡', '😇', '😈', '💩'];

  res.status(200).json({
    success: true,
    message: 'All emojis.',
    data: emojis,
  });
});
