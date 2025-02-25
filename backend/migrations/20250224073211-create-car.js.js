module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cars', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      registration: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      marque: {
        type: Sequelize.STRING,
        allowNull: false
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false
      },
      driver_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Drivers',
          key: 'id'
        }
      },
      owner_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Owners',
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
    await queryInterface.dropTable('Cars');
  }
};