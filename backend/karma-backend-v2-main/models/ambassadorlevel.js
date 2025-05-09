'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class AmbassadorLevel extends Model {
    static associate(models) {}
  }
  AmbassadorLevel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: { type: DataTypes.STRING },
      lives: { type: DataTypes.INTEGER },
      profitPercentage: { type: DataTypes.FLOAT },
      usersCount: { type: DataTypes.INTEGER },
      isDefault: { type: DataTypes.BOOLEAN },

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'AmbassadorLevel',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return AmbassadorLevel
}
