module.exports = (sequelize, DataTypes) => {
    const Driver = sequelize.define('Driver', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_mobile: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING
        },
        permis: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Driver.associate = (models) => {
        Driver.hasMany(models.Car, {
            foreignKey: 'driver_id',
            as: 'cars'
        });
    };

    return Driver;
};
