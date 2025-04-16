import { config } from "dotenv";
config();

import app from "./app.ttts";
import db from './models';

const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        // await db.sequelize.sync({ force: true });
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running at http://localhost:${process.env.PORT}`);
        })
    } catch (error: any) {
        console.error("Unable to connect to the database")
    }
}

startServer();

export { };