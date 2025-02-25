module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Routes', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE
      },
      distance_traveled: {
        type: Sequelize.FLOAT
      },
      travel_cost: {
        type: Sequelize.INTEGER
      },
      car_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Cars',
          key: 'id'
        }
      },
      position_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Positions',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Routes');
  }
};