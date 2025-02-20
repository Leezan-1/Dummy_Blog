const { where } = require("sequelize");

const { Users } = require("../models").sequelize.models

class UserService {
    static async signUpUser(userInfo) {
        console.log('UserService.signUpUser()');
        console.log('userInfo :>> ', userInfo);
        try {

            let userExists = await Users.findOne({ where: { email: userInfo.email } })
            if (userExists)
                throw new Error('User Already Exists');

            let user = Users.build({
                first_name: userInfo['fname'],
                last_name: userInfo['lname'],
                email: userInfo['email'],
                password: userInfo['password']
            })

            await user.save();
            return user;
        } catch (error) {
            console.log('UserService.signUpUser()');
            throw new Error(`${error}`)
            console.log('User Service error :>> ', error);

        }
    }

    static async loginUser(userInfo) {

    }

}

module.exports = UserService;