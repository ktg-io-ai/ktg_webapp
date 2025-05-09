'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class WalletToken extends Model {
    static associate(models) {}
  }
  WalletToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      tokenName: { type: DataTypes.STRING },
      tokenLife: { type: DataTypes.INTEGER },
      tokenPrice: { type: DataTypes.FLOAT },
      expiresIn: { type: DataTypes.INTEGER }, // days
      expiryNotificationAfter: { type: DataTypes.INTEGER }, // days
      profileDeactivatesIn: { type: DataTypes.INTEGER }, // days
      isDefault: { type: DataTypes.BOOLEAN },

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'WalletToken',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return WalletToken
}
