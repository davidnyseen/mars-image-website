'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('marsImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      catID: {
        type: Sequelize.STRING
      },
      imageSorce: {
        type: Sequelize.STRING
      },
      earthDate: {
        type: Sequelize.STRING
      },
      solDate: {
        type: Sequelize.STRING
      },
      roger: {
        type: Sequelize.STRING
      },
      camera: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('marsImages');
  }
};