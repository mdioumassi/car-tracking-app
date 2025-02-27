'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('routes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      pickup_point: {
        type: Sequelize.STRING,
        allowNull: false
      },
      destination_point: {
        type: Sequelize.STRING,
        allowNull: false
      },
      distance_traveled: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      travel_cost: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      todays_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      car_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'cars',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('routes');
  }
};