'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class RequestLog extends Model {
    static associate(models) {}
  }
  RequestLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ipAddress: DataTypes.STRING,
      url: DataTypes.TEXT,
      referral: DataTypes.TEXT,
      uaName: DataTypes.TEXT,
      uaVersion: DataTypes.TEXT,
      uaOS: DataTypes.TEXT,
      uaDescription: DataTypes.TEXT,
      otherInfo: DataTypes.TEXT,
      params: DataTypes.TEXT,
      query: DataTypes.TEXT,
      body: DataTypes.TEXT,
      userProfileId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'RequestLog',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return RequestLog
}
