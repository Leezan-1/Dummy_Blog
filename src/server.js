require('dotenv').config();
const app = require('./app');
const mysqlSequelize = require('./config/db');

const startServer = async () => {
    try {
        await mysqlSequelize.authenticate();

        app.listen(process.env.PORT, () => {
            console.log(`Server running at http://localhost:${process.env.PORT} ✅`);
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

};

startServer();