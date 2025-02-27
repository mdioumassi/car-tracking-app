const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Driver extends Model {
        static associate(models) {
            // Associations
            Driver.belongsTo(models.User, { foreignKey: 'driver_id', as: 'user' });
            Driver.hasMany(models.Car, { foreignKey: 'driver_id', as: 'assignedCars' });
        }
    }

    Driver.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        permis: {
            type: DataTypes.STRING,
            allowNull: false
        },
        current_position: {
            type: DataTypes.STRING,
            allowNull: true
        },
        driver_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Driver',
        tableName: 'drivers'
    });

    return Driver;
};