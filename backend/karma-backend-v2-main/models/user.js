'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UserProfile, {
        sourceKey: 'userProfileId', // current table field `User`.`userProfileId`
        foreignKey: 'id', // target table field `UserProfile`.`id`
        as: 'userProfile',
      })
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userProfileId: DataTypes.UUID,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isEmailVerified: DataTypes.BOOLEAN,
      emailVerificationToken: DataTypes.TEXT,
      emailVerificationOTP: DataTypes.STRING,
      emailVerificationExpiry: DataTypes.DATE,
      resetPasswordToken: DataTypes.TEXT,
      resetPasswordExpiry: DataTypes.DATE,

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return User
}
