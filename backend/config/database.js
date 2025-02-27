require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'car_management_db',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT+0',
        },
        logging: console.log
    },
    test: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME_TEST || 'car_management_db_test',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT+0',
        },
        logging: false
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT+0',
        },
        logging: false
    }
};