const { wrapController } = require("../utils/asyncwrappers");
const UserService = require('../services/userService');

const signUpController = wrapController(async (req, res) => {
    console.log('signUpController()');

    const user = await UserService.signUpUser(req.body);

    res.json(user);
});

module.exports = { signUpController };