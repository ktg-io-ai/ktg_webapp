'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AmbassadorCodes', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      ambassadorId: { type: Sequelize.UUID, allowNull: false },
      code: { type: Sequelize.STRING, allowNull: false },

      platform: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.UUID },
      updatedBy: { type: Sequelize.UUID },

      deletedAt: { type: Sequelize.DATE, defaultValue: null },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AmbassadorCodes')
  },
}
