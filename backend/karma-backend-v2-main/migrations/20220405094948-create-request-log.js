'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequestLogs', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      ipAddress: { type: Sequelize.STRING },
      url: { type: Sequelize.TEXT },
      referral: { type: Sequelize.TEXT },
      uaName: { type: Sequelize.TEXT },
      uaVersion: { type: Sequelize.TEXT },
      uaOS: { type: Sequelize.TEXT },
      uaDescription: { type: Sequelize.TEXT },
      otherInfo: { type: Sequelize.TEXT },
      params: { type: Sequelize.TEXT },
      query: { type: Sequelize.TEXT },
      body: { type: Sequelize.TEXT },
      userProfileId: { type: Sequelize.UUID },

      createdBy: { type: Sequelize.UUID },
      updatedBy: { type: Sequelize.UUID },

      deletedAt: { type: Sequelize.DATE, defaultValue: null },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RequestLogs')
  },
}
