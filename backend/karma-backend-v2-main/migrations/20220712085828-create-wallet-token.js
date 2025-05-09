'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WalletTokens', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      tokenName: { type: Sequelize.STRING, allowNull: false, unique: true },
      tokenLife: { type: Sequelize.INTEGER, allowNull: false },
      tokenPrice: { type: Sequelize.FLOAT, allowNull: false },
      expiresIn: { type: Sequelize.INTEGER, allowNull: false }, // days
      expiryNotificationAfter: { type: Sequelize.INTEGER, allowNull: false }, // days
      profileDeactivatesIn: { type: Sequelize.INTEGER, allowNull: false }, // days
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
    await queryInterface.dropTable('WalletTokens')
  },
}
