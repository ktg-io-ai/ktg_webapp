'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PurchasedTokenHistory', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      userProfileId: { type: Sequelize.UUID, allowNull: false },
      walletTokenId: { type: Sequelize.UUID, allowNull: false },
      appliedOn: { type: Sequelize.DATE },
      tokenLife: { type: Sequelize.INTEGER, allowNull: false },
      zapCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      tokenPrice: { type: Sequelize.FLOAT, allowNull: false },

      platform: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.UUID },
      updatedBy: { type: Sequelize.UUID },

      deletedAt: { type: Sequelize.DATE, defaultValue: null },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PurchasedTokenHistory')
  },
}
