'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserWalletToken extends Model {
    static associate(models) {}
  }
  UserWalletToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userProfileId: { type: DataTypes.UUID },
      walletTokenId: { type: DataTypes.UUID },
      isCurrentActive: { type: DataTypes.BOOLEAN },
      appliedOn: { type: DataTypes.DATE },
      tokenLife: { type: DataTypes.INTEGER },
      zapCount: { type: DataTypes.INTEGER },
      isFreshPurchase: { type: DataTypes.BOOLEAN },
      isAutoApplied: { type: DataTypes.BOOLEAN },
      profileDeactivatesIn: { type: DataTypes.INTEGER },
      expiresIn: { type: DataTypes.INTEGER },
      expiryNotificationAfter: { type: DataTypes.INTEGER }, // days

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'UserWalletToken',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return UserWalletToken
}
