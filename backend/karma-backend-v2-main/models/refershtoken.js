'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {}
  }
  RefreshToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userProfile: DataTypes.UUID,
      token: DataTypes.TEXT,

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return RefreshToken
}
