const { wrapController } = require("../utils/asyncwrappers");
const UserService = require('../services/userService');
const JWTService = require("../services/jwtService");
const ApiResponse = require("../utils/apiMessage");
const CustomError = require("../utils/CustomError");

const signUpCTLR = wrapController(async (req, res) => {

    await UserService.signUpUser(req.body);

    res.status(201)
        .json(ApiResponse.success(201));

});

const loginUserCTLR = wrapController(async (req, res) => {

    const user = await UserService.loginUser(req.body);

    const refreshToken = await JWTService.genRefresh(user);
    delete user?.id;
    const accessToken = await JWTService.genAccess(user);

    res.status(200)
        .cookie('refresh-token', refreshToken, { httpOnly: true, sameSite: "strict", expiry: Date.now() + 3 * 24 * 60 * 60 * 1000, secure: true })
        .json({
            user: user, access_token: accessToken
        });

});

const generateRefreshCTLR = wrapController(async (req, res) => {

    let token = req.cookies['refresh-token'];
    if (!token)
        throw new CustomError('Token missing!', 401);

    // let { authorization } = req.headers;
    // const token = JWTService.checkTokenHeader(authorization);

    const { accessToken, refreshToken } = await JWTService.regenRefreshAndAccess(token);

    res.status(200)
        .cookie('refresh-token', refreshToken, { httpOnly: true, expiry: Date.now() + 3 * 24 * 60 * 60 * 1000, secure: true })
        .json({
            access_token: accessToken
        });

});

const logoutUserCTRL = wrapController(async (req, res) => {

    const user = req.user;
    await JWTService.deleteRefreshByUserID(user.id);

    res.status(200)
        .clearCookie('refresh-token')
        .json(ApiResponse.success(200, 'User logged out!'));
});

module.exports = { signUpCTLR, loginUserCTLR, logoutUserCTRL, generateRefreshCTLR };