const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Car extends Model {
        static associate(models) {
            // Associations
            Car.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
            Car.belongsTo(models.Driver, { foreignKey: 'driver_id', as: 'driver' });
            Car.hasMany(models.Route, { foreignKey: 'car_id', as: 'routes' });
        }
    }

    Car.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        registration_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        marque: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        car_insurance: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        car_gray: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        driver_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'drivers',
                key: 'id'
            }
        },
        owner_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Car',
        tableName: 'cars'
    });

    return Car;
};