'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserProfiles', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      profileName: { type: Sequelize.STRING, unique: true, allowNull: false },
      avatar3D: Sequelize.UUID,
      birthDate: Sequelize.DATE,
      tagline: Sequelize.TEXT,
      timezone: Sequelize.STRING,
      phone: Sequelize.STRING,
      roles: { type: Sequelize.JSON, defaultValue: ['PLAYER'] },
      ambassadorUserId: Sequelize.UUID,
      tos: { type: Sequelize.BOOLEAN, defaultValue: false },

      platform: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.UUID },
      updatedBy: { type: Sequelize.UUID },

      deletedAt: { type: Sequelize.DATE, defaultValue: null },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserProfiles')
  },
}
