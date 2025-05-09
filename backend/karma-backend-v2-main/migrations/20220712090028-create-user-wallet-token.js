'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserWalletTokens', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      userProfileId: { type: Sequelize.UUID, allowNull: false },
      walletTokenId: { type: Sequelize.UUID, allowNull: false },
      isCurrentActive: { type: Sequelize.BOOLEAN, defaultValue: false },
      appliedOn: { type: Sequelize.DATE },
      tokenLife: { type: Sequelize.INTEGER, allowNull: false },
      zapCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      isFreshPurchase: { type: Sequelize.BOOLEAN, defaultValue: false },
      isAutoApplied: { type: Sequelize.BOOLEAN, defaultValue: false },
      profileDeactivatesIn: { type: Sequelize.INTEGER, allowNull: false },
      expiresIn: { type: Sequelize.INTEGER, allowNull: false },
      expiryNotificationAfter: { type: DataTypes.INTEGER, allowNull: false }, // days

      platform: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.UUID },
      updatedBy: { type: Sequelize.UUID },

      deletedAt: { type: Sequelize.DATE, defaultValue: null },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserWalletTokens')
  },
}
