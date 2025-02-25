module.exports = (sequelize, DataTypes) => {
    const Position = sequelize.define('Position', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        horodatage: {
            type: DataTypes.DATE,
            allowNull: false
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        vitesse: {
            type: DataTypes.FLOAT
        }
    });

    Position.associate = (models) => {
        Position.hasMany(models.Route, {
            foreignKey: 'position_id',
            as: 'routes'
        });
    };

    return Position;
};