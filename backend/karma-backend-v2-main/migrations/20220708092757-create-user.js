'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      userProfileId: Sequelize.UUID,
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: Sequelize.STRING,
      isEmailVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      emailVerificationToken: Sequelize.TEXT,
      emailVerificationOTP: Sequelize.STRING,
      emailVerificationExpiry: Sequelize.DATE,
      resetPasswordToken: Sequelize.TEXT,
      resetPasswordExpiry: Sequelize.DATE,

      platform: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.UUID },
      updatedBy: { type: Sequelize.UUID },

      deletedAt: { type: Sequelize.DATE, defaultValue: null },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
  },
}
