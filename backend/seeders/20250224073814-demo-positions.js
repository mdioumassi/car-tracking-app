'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Positions', [
      {
        horodatage: new Date(),
        latitude: 48.8566,
        longitude: 2.3522,
        vitesse: 50.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        horodatage: new Date(),
        latitude: 45.7640,
        longitude: 4.8357,
        vitesse: 45.2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        horodatage: new Date(),
        latitude: 43.2965,
        longitude: 5.3698,
        vitesse: 60.8,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Positions', null, {});
  }
};