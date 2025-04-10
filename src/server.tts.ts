import { config } from "dotenv";
import app from "./app.ttts";

config();

const startServer = async () => {
    try {
        app.listen(3000, () => {
            console.log(`Server running at http://localhost:${3000}`);
        })
    } catch (error: any) {
        console.error("Unable to connect to the database")
    }
}

startServer();

export { startServer };