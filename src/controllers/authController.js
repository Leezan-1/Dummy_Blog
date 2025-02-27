const { wrapController } = require("../utils/asyncwrappers");
const UserService = require('../services/userService');

const signUpController = wrapController(async (req, res) => {

    const user = await UserService.signUpUser(req.body);
    res.status(201).json(user);

});

const loginUserController = wrapController(async (req, res) => {

    const user = await UserService.loginUser(req.body);
    res.status(200).json(user);

});

module.exports = { signUpController, loginUserController };