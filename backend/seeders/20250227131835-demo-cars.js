'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Récupérer l'ID du propriétaire
    const owners = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE type_user = "proprietaire" LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Récupérer l'ID du conducteur
    const drivers = await queryInterface.sequelize.query(
      'SELECT id FROM drivers LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (owners.length === 0) {
      console.warn('Aucun utilisateur propriétaire trouvé pour créer une voiture');
      return;
    }

    const ownerId = owners[0].id;
    const driverId = drivers.length > 0 ? drivers[0].id : null;

    return queryInterface.bulkInsert('cars', [
      {
        registration_number: 'AB-123-CD',
        marque: 'Renault',
        model: 'Clio',
        car_insurance: 1,
        car_gray: 1,
        driver_id: driverId,
        owner_id: ownerId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        registration_number: 'EF-456-GH',
        marque: 'Peugeot',
        model: '308',
        car_insurance: 1,
        car_gray: 1,
        driver_id: driverId,
        owner_id: ownerId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('cars', null, {});
  }
};