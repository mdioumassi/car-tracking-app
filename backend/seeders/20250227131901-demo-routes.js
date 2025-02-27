'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Récupérer l'ID d'une voiture
    const cars = await queryInterface.sequelize.query(
      'SELECT id FROM cars LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (cars.length === 0) {
      console.warn('Aucune voiture trouvée pour créer des routes');
      return;
    }

    const carId = cars[0].id;

    return queryInterface.bulkInsert('routes', [
      {
        pickup_point: 'Paris',
        destination_point: 'Lyon',
        distance_traveled: 465.5,
        travel_cost: 120,
        todays_date: new Date(),
        car_id: carId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pickup_point: 'Lyon',
        destination_point: 'Marseille',
        distance_traveled: 314.2,
        travel_cost: 85,
        todays_date: new Date(),
        car_id: carId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('routes', null, {});
  }
};