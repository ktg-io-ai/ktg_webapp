'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class WalletTokenPaymentHistory extends Model {
    static associate(models) {}
  }
  WalletTokenPaymentHistory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userProfileId: { type: DataTypes.UUID, allowNull: false },
      walletTokenId: { type: DataTypes.UUID, allowNull: false },
      tokenPrice: { type: DataTypes.FLOAT, allowNull: false },
      purchasedOn: { type: DataTypes.DATE, allowNull: false },
      referenceId: { type: DataTypes.STRING },

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'WalletTokenPaymentHistory',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return WalletTokenPaymentHistory
}
