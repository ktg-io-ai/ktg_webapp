'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PurchasedTokenHistory extends Model {
    static associate(models) {}
  }
  PurchasedTokenHistory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userProfileId: { type: DataTypes.UUID },
      walletTokenId: { type: DataTypes.UUID },
      appliedOn: { type: DataTypes.DATE },
      tokenLife: { type: DataTypes.INTEGER },
      zapCount: { type: DataTypes.INTEGER },
      tokenPrice: { type: DataTypes.FLOAT },

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'PurchasedTokenHistory',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return PurchasedTokenHistory
}
