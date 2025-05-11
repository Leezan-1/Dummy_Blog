// built-in & third party modules
// configs and resources
import app from "./app";
import { config } from "dotenv";

// models and services
import db from './models';


config();

const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        // await db.sequelize.sync({ force: true });
        // await db.sequelize.sync({ alter: true });
        app.listen(process.env.PORT || 5000, () => {
            // console.log('process.env :>> ', process.env);
            console.log(`Server running at ${process.env.BASE_URL!}`);
        })
    } catch (error) {
        console.error("Unable to connect to the database\n", error)
    }
}

startServer();

export { };