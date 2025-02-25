'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const owners = await queryInterface.select(null, 'Owners', { limit: 3 });
    const drivers = await queryInterface.select(null, 'Drivers', { limit: 3 });

    return queryInterface.bulkInsert('Cars', [
      {
        registration: 'AA-123-BB',
        marque: 'Renault',
        model: 'Clio',
        driver_id: drivers[0].id,
        owner_id: owners[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        registration: 'CC-456-DD',
        marque: 'Peugeot',
        model: '308',
        driver_id: drivers[1].id,
        owner_id: owners[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        registration: 'EE-789-FF',
        marque: 'Citroën',
        model: 'C3',
        driver_id: drivers[2].id,
        owner_id: owners[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Cars', null, {});
  }
};