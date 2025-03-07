require("dotenv").config();
const bcrypt = require('bcrypt');

async function generatePassword(userPassword) {
    const hashed = await bcrypt.hash(userPassword, Number(process.env.SALT_ROUNDS));
    return hashed;
}

async function checkUserPassword(userPassword, dbStoredPasswordHash) {
    const match = await bcrypt.compare(userPassword, dbStoredPasswordHash);
    return match ? true : false;
}

module.exports = { generatePassword, checkUserPassword };