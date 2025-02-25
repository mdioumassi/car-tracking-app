module.exports = (sequelize, DataTypes) => {
    const Car = sequelize.define('Car', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        registration: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        marque: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'Drivers',
                key: 'id'
            }
        },
        owner_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'Owners',
                key: 'id'
            }
        }
    });

    Car.associate = (models) => {
        Car.belongsTo(models.Owner, {
            foreignKey: 'owner_id',
            as: 'owner'
        });
        Car.belongsTo(models.Driver, {
            foreignKey: 'driver_id',
            as: 'driver'
        });
        Car.hasMany(models.Route, {
            foreignKey: 'car_id',
            as: 'routes'
        });
    };

    return Car;
};