'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const cars = await queryInterface.select(null, 'Cars', { limit: 3 });
    const positions = await queryInterface.select(null, 'Positions', { limit: 3 });

    return queryInterface.bulkInsert('Routes', [
      {
        start_date: new Date(2024, 1, 1),
        end_date: new Date(2024, 1, 1, 2, 0),
        distance_traveled: 120.5,
        travel_cost: 25,
        car_id: cars[0].id,
        position_id: positions[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        start_date: new Date(2024, 1, 2),
        end_date: new Date(2024, 1, 2, 3, 30),
        distance_traveled: 250.8,
        travel_cost: 45,
        car_id: cars[1].id,
        position_id: positions[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        start_date: new Date(2024, 1, 3),
        end_date: new Date(2024, 1, 3, 1, 45),
        distance_traveled: 85.3,
        travel_cost: 15,
        car_id: cars[2].id,
        position_id: positions[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Routes', null, {});
  }
};