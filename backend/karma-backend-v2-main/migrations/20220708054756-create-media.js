'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Media', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      name: { type: Sequelize.STRING },
      originalFile: { type: Sequelize.TEXT },
      originalMimeType: { type: Sequelize.STRING },
      originalSize: { type: Sequelize.INTEGER },
      path: { type: Sequelize.TEXT },
      mimeType: { type: Sequelize.STRING },
      size: { type: Sequelize.STRING },
      sizes: { type: Sequelize.JSON },
      isPrivate: { type: Sequelize.BOOLEAN, defaultValue: false },
      isBase64: { type: Sequelize.BOOLEAN },

      platform: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.UUID },
      updatedBy: { type: Sequelize.UUID },

      deletedAt: { type: Sequelize.DATE, defaultValue: null },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Media')
  },
}
