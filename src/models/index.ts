import config from '../config/config.json';

import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import fs from 'fs';

const env: string = (process.env.NODE_ENV as string) || "development";
const dbConfig = (config as any)[env];

const db: {
    sequelize: Sequelize,
    Sequelize: typeof Sequelize,
} = {} as any;

const modelsDir = __dirname;
const modelFiles = fs
    .readdirSync(modelsDir)
    .filter(file =>
        file.endsWith('.ts') &&        // only TS files
        file !== 'index.ts'            // exclude index.ts
    )
    .map(file => path.join(modelsDir, file));


// initialize sequelize
let sequelize = new Sequelize({
    host: dbConfig.host!,
    dialect: dbConfig.dialect!,
    database: dbConfig.database!,
    username: dbConfig.username!,
    password: dbConfig.password!,
    logging: dbConfig.logging! || false,
    models: modelFiles,
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
