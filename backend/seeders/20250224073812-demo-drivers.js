'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Drivers', [
      {
        firstname: 'Lucas',
        lastname: 'Petit',
        phone_mobile: '0612345678',
        address: '321 Rue de Lyon, 69001 Lyon',
        permis: 'B123456789',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstname: 'Sophie',
        lastname: 'Dubois',
        phone_mobile: '0612345679',
        address: '654 Avenue Jean Jaurès, 69007 Lyon',
        permis: 'B987654321',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstname: 'Thomas',
        lastname: 'Moreau',
        phone_mobile: '0612345670',
        address: '987 Rue Garibaldi, 69003 Lyon',
        permis: 'B456789123',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Drivers', null, {});
  }
};