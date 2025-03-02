const { wrapController } = require("../utils/asyncwrappers");
const UserService = require('../services/userService');
const JWTService = require("../services/jwtService");

const signUpCTLR = wrapController(async (req, res) => {

    const user = await UserService.signUpUser(req.body);

    const refreshToken = await JWTService.genRefresh(user);
    const accessToken = await JWTService.genAccess(user);

    delete user?.id;

    res.status(201)
        .cookie('refresh-token', refreshToken, { httpOnly: true, expiry: Date.now() + 3 * 24 * 60 * 60 * 1000, secure: true })
        .json({
            user: user,
            access_token: accessToken
        });

});

const loginUserCTLR = wrapController(async (req, res) => {

    const user = await UserService.loginUser(req.body);
    const refreshToken = await JWTService.genRefresh(user);
    // delete user.id;
    // delete user.email;
    const accessToken = await JWTService.genAccess(user);

    res.status(200)
        .cookie('refresh-token', refreshToken, { httpOnly: true, expiry: Date.now() + 3 * 24 * 60 * 60 * 1000, secure: true })
        .json({
            user: user, access_token: accessToken
        });

});

const generateRefreshCTLR = wrapController(async (req, res) => {
    let { authorization } = req.headers;

    const token = JWTService.checkTokenHeader(authorization);

    const { accessToken, refreshToken } = await JWTService.regenRefreshAndAccess(token);

    res.status(200)
        .cookie('refresh-token', refreshToken, { httpOnly: true, expiry: Date.now() + 3 * 24 * 60 * 60 * 1000, secure: true })
        .json({
            access_token: accessToken
        });

});

const logoutUserCTRL = wrapController(async (req, res) => {

});

module.exports = { signUpCTLR, loginUserCTLR, logoutUserCTRL, generateRefreshCTLR };