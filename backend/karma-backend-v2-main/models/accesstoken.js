'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class AccessToken extends Model {
    static associate(models) {}
  }
  AccessToken.init(
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
      modelName: 'AccessToken',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return AccessToken
}
