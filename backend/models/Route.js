const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Route extends Model {
        static associate(models) {
            // Associations
            Route.belongsTo(models.Car, { foreignKey: 'car_id', as: 'car' });
        }
    }

    Route.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        pickup_point: {
            type: DataTypes.STRING,
            allowNull: false
        },
        destination_point: {
            type: DataTypes.STRING,
            allowNull: false
        },
        distance_traveled: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        travel_cost: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        todays_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        car_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'cars',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Route',
        tableName: 'routes'
    });

    return Route;
};