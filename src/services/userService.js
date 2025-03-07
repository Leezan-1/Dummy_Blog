
const { Users } = require("../models").sequelize.models
const { checkUserPassword, generatePassword } = require("../utils/password");
const CustomError = require("../utils/CustomError");

class UserService {
    // creates a new user
    static async signUpUser(userInfo) {

        // checks if there is any other user with same email address.
        let userExists = await Users.findOne({ where: { email: userInfo.email } });
        if (userExists)
            throw new CustomError('User Already Exists', 409);

        // stores hashed password for user.
        let hashedPassword = await generatePassword(userInfo.password);

        // creates a new user.
        await Users.create({
            first_name: userInfo?.fname,
            last_name: userInfo?.lname,
            email: userInfo?.email,
            password: hashedPassword
        });
    }

    // authenticate user with credentials and gets user's info.
    static async loginUser(userInfo) {

        // find users with email address.
        let user = await Users.findOne({ where: { email: userInfo.email } })
        if (!user)
            throw new CustomError('User Not Found', 404);

        // check password is valid, if false send error
        if (!(await checkUserPassword(userInfo.password, user.password)))
            throw new CustomError('Email or password didnot match', 200);

        return JSON.parse(JSON.stringify(user));

    }

    // gets user's information by email.
    static async getUserByEmail(email) {
        const user = await Users.findOne({ where: { email: email } });
        return JSON.parse(JSON.stringify(user));
    }
}

module.exports = UserService;