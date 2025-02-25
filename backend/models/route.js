module.exports = (sequelize, DataTypes) => {
    const Route = sequelize.define('Route', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE
        },
        distance_traveled: {
            type: DataTypes.FLOAT
        },
        travel_cost: {
            type: DataTypes.INTEGER
        },
        car_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'Cars',
                key: 'id'
            }
        },
        position_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'Positions',
                key: 'id'
            }
        }
    });

    Route.associate = (models) => {
        Route.belongsTo(models.Car, {
            foreignKey: 'car_id',
            as: 'car'
        });
        Route.belongsTo(models.Position, {
            foreignKey: 'position_id',
            as: 'position'
        });
    };

    return Route;
};