module.exports = (sequelize, DataTypes) => {
    const Owner = sequelize.define('Owner', {
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
        address: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING
        }
    });

    Owner.associate = (models) => {
        Owner.hasMany(models.Car, {
            foreignKey: 'owner_id',
            as: 'cars'
        });
    };

    return Owner;
};