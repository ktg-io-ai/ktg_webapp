'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {}
  }
  Group.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: { type: DataTypes.STRING, allowNull: false },
      color: { type: DataTypes.STRING },

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'Group',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return Group
}
