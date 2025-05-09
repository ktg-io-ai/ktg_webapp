'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Avatar3D extends Model {
    static associate(models) {
      Avatar3D.hasOne(models.Group, {
        sourceKey: 'groupId',
        foreignKey: 'id',
        as: 'group',
      })

      Avatar3D.hasOne(models.Media, {
        sourceKey: 'avatar2D', // current table field `User`.`userProfileId`
        foreignKey: 'id', // target table field `UserProfile`.`id`
        as: 'avatarPhoto',
      })
    }
  }
  Avatar3D.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      groupId: { type: DataTypes.UUID },
      name: { type: DataTypes.STRING },
      avatar2D: { type: DataTypes.UUID },

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'Avatar3D',
      tableName: 'Avatar3D',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return Avatar3D
}
