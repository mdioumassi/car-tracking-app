'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Récupérer l'ID de l'utilisateur conducteur
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE type_user = "conducteur" LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.warn('Aucun utilisateur conducteur trouvé pour créer un driver');
      return;
    }

    const driverId = users[0].id;

    return queryInterface.bulkInsert('drivers', [
      {
        permis: 'B12345678',
        current_position: 'Paris',
        driver_id: driverId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('drivers', null, {});
  }
};