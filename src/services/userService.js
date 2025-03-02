
const { Users } = require("../models").sequelize.models
const CustomError = require("../utils/CustomError");

class UserService {
    static async signUpUser(userInfo) {
        let userExists = await Users.findOne({ where: { email: userInfo.email } })

        if (userExists)
            throw new CustomError('User Already Exists', 409);

        let user = Users.build({
            first_name: userInfo['fname'],
            last_name: userInfo['lname'],
            email: userInfo['email'],
            password: userInfo['password']
        });

        await user.save();
    }

    static async loginUser(userInfo) {
        let user = await Users.findOne({ where: { email: userInfo.email } })
        if (!user)
            throw new CustomError('User Not Found', 404);


        // password logic need to be implemented
        return JSON.parse(JSON.stringify(user));

    }

    static async logoutUser() {

    }

    static async getUserByEmail(email) {
        const user = await Users.findOne({ where: { email: email } });
        return JSON.parse(JSON.stringify(user));
    }
}

module.exports = UserService;