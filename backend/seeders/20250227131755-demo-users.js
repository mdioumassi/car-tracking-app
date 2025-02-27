'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    return queryInterface.bulkInsert('users', [
      {
        username: 'admin1',
        password: hashedPassword,
        civility: 'M',
        type_user: 'admin',
        firstname: 'Admin',
        lastname: 'User',
        phone: '0123456789',
        email: 'admin@example.com',
        address: '123 Admin Street',
        country: 'France',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'proprietaire1',
        password: hashedPassword,
        civility: 'Mme',
        type_user: 'proprietaire',
        firstname: 'Marie',
        lastname: 'Dupont',
        phone: '0123456780',
        email: 'marie@example.com',
        address: '456 Owner Street',
        country: 'France',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'conducteur1',
        password: hashedPassword,
        civility: 'M',
        type_user: 'conducteur',
        firstname: 'Pierre',
        lastname: 'Martin',
        phone: '0123456781',
        email: 'pierre@example.com',
        address: '789 Driver Street',
        country: 'France',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};