'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmailLogs', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      type: Sequelize.STRING,
      sender: Sequelize.TEXT,
      receiver: Sequelize.TEXT,
      log: { type: Sequelize.JSON, defaultValue: {} },

      platform: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.UUID },
      updatedBy: { type: Sequelize.UUID },

      deletedAt: { type: Sequelize.DATE, defaultValue: null },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EmailLogs')
  },
}
