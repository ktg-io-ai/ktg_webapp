'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class EmailLog extends Model {
    static associate(models) {}
  }
  EmailLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      type: DataTypes.STRING,
      sender: DataTypes.TEXT,
      receiver: DataTypes.TEXT,
      log: { type: DataTypes.JSON, defaultValue: {} },

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'EmailLog',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return EmailLog
}
