'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ZappedUserTrack extends Model {
    static associate(models) {}
  }
  ZappedUserTrack.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userProfileId: { type: DataTypes.UUID },
      oldProfileName: { type: DataTypes.STRING },
      newProfileName: { type: DataTypes.STRING },

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'ZappedUserTrack',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return ZappedUserTrack
}
