'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Owners', [
      {
        firstname: 'Jean',
        lastname: 'Dupont',
        address: '123 Rue de Paris, 75001 Paris',
        email: 'jean.dupont@email.com',
        phone: '0123456789',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstname: 'Marie',
        lastname: 'Martin',
        address: '456 Avenue des Champs-Élysées, 75008 Paris',
        email: 'marie.martin@email.com',
        phone: '0123456780',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstname: 'Pierre',
        lastname: 'Bernard',
        address: '789 Boulevard Saint-Germain, 75006 Paris',
        email: 'pierre.bernard@email.com',
        phone: '0123456781',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Owners', null, {});
  }
};