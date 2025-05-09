'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class AmbassadorCode extends Model {
    static associate(models) {
      AmbassadorCode.hasOne(models.UserProfile, {
        sourceKey: 'ambassadorId', // current table field `User`.`userProfileId`
        foreignKey: 'id', // target table field `UserProfile`.`id`
        as: 'ambassador',
      })
    }
  }
  AmbassadorCode.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      ambassadorId: { type: DataTypes.UUID, allowNull: false },
      code: { type: DataTypes.STRING, allowNull: false },

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'AmbassadorCode',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return AmbassadorCode
}
