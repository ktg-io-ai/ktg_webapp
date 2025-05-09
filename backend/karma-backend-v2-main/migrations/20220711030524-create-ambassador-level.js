'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AmbassadorLevels', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      name: { type: Sequelize.STRING, allowNull: false },
      lives: { type: Sequelize.INTEGER, allowNull: false },
      profitPercentage: { type: Sequelize.FLOAT, defaultValue: 0 },
      usersCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      isDefault: { type: Sequelize.BOOLEAN, defaultValue: false },

      platform: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.UUID },
      updatedBy: { type: Sequelize.UUID },

      deletedAt: { type: Sequelize.DATE, defaultValue: null },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AmbassadorLevels')
  },
}
