'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, {
        targetKey: 'userProfileId', // target table field `User`.`userProfileId`
        foreignKey: 'id', // current table field `UserProfile`.`id`
        as: 'user',
      })

      UserProfile.hasOne(models.Avatar3D, {
        sourceKey: 'avatar3D', // current table field `User`.`userProfileId`
        foreignKey: 'id', // target table field `UserProfile`.`id`
        as: 'avatar',
      })

      UserProfile.hasOne(models.UserProfile, {
        sourceKey: 'ambassadorUserId', // current table field `User`.`userProfileId`
        foreignKey: 'id', // target table field `UserProfile`.`id`
        as: 'ambassador',
      })
    }
  }
  UserProfile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      profileName: DataTypes.STRING,
      avatar3D: DataTypes.UUID,
      birthDate: DataTypes.DATE,
      tagline: DataTypes.TEXT,
      timezone: DataTypes.STRING,
      phone: DataTypes.STRING,
      roles: DataTypes.JSON,
      ambassadorUserId: DataTypes.UUID,
      tos: DataTypes.BOOLEAN,

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'UserProfile',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return UserProfile
}
