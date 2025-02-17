require('dotenv').config();

const { Sequelize } = require('sequelize');

const mysqlSequelize = new Sequelize({
    username: process.env.USR,
    password: process.env.PSWD,
    database: process.env.DB,
    host: process.env.HOST,
    dialect: 'mysql'
});

module.exports = mysqlSequelize;