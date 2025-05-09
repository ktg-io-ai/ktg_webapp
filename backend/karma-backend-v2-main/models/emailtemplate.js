'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class EmailTemplate extends Model {
    static associate(models) {}
  }
  EmailTemplate.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: DataTypes.STRING,
      body: DataTypes.TEXT,

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'EmailTemplate',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return EmailTemplate
}
