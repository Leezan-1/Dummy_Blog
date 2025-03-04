require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const startServer = async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ alter: true });
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running at http://localhost:${process.env.PORT} ✅`);
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

};

startServer();