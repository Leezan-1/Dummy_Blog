
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
        return user;

    }

    static async loginUser(userInfo) {
        let userExists = await Users.findOne({ where: { email: userInfo.email } })

        if (!userExists)
            throw new CustomError('User Not Found', 404);

        return userExists;

    }


}

module.exports = UserService;