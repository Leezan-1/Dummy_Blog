// built-in & third party modules
import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';

// configs and resources
import config from '../config/config.json';

// models and services
import { Post } from './Post';
import { User } from './User';
import { Post_Images } from './Post_Images';
import { Post_Tag } from './Post_Tag';
import { Tag } from './Tag';
import { Profile } from './Profile';
import { Token } from './Token';
import { Otp } from './Otp';
import { Post_Comments } from './Post_Comments';


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

// const modelClasses = modelFiles.map(file => {
//     const imported = require(file); // or import() with async/await
//     return Object.values(imported); // handle both default and named exports
// }).flat();


// initialize sequelize
let sequelize = new Sequelize({
    host: dbConfig.host!,
    dialect: dbConfig.dialect!,
    database: dbConfig.database!,
    username: dbConfig.username!,
    password: dbConfig.password!,
    logging: dbConfig.logging! || false,
    models: [User, Profile, Post, Post_Images, Post_Tag, Tag, Token, Otp, Post_Comments],
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
