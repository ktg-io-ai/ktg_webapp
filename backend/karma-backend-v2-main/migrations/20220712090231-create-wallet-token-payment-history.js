'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WalletTokenPaymentHistory', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      userProfileId: { type: Sequelize.UUID, allowNull: false },
      walletTokenId: { type: Sequelize.UUID, allowNull: false },
      tokenPrice: { type: Sequelize.FLOAT, allowNull: false },
      purchasedOn: { type: Sequelize.DATE, allowNull: false },
      referenceId: { type: Sequelize.STRING },

      platform: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.UUID },
      updatedBy: { type: Sequelize.UUID },

      deletedAt: { type: Sequelize.DATE, defaultValue: null },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WalletTokenPaymentHistory')
  },
}
