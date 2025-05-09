'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Media.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      name: { type: DataTypes.STRING },
      originalFile: { type: DataTypes.TEXT },
      originalMimeType: { type: DataTypes.STRING },
      originalSize: { type: DataTypes.INTEGER },
      path: { type: DataTypes.TEXT },
      mimeType: { type: DataTypes.STRING },
      size: { type: DataTypes.STRING },
      sizes: { type: DataTypes.JSON },
      isPrivate: { type: DataTypes.BOOLEAN },
      isBase64: { type: DataTypes.BOOLEAN },

      platform: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: 'Media',
      paranoid: true, // soft-deletion
      deletedAt: 'deletedAt', // deletedAt column
      timestamps: true,
    }
  )
  return Media
}
