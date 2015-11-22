import Sequelize from 'sequelize';
import credentials from '../credentials/db';

// how to config this?
let sequelize = new Sequelize(
    credentials.database,
    credentials.username,
    credentials.password,
    {
        host: credentials.host,
        dialect: 'mysql',

        pool: {
            max: 10,
            min: 0,
            idle: 10000
        },

        // disable logging; default: console.log
        logging: false
});

export default sequelize;
