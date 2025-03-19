/*
    This handles authentication controllers for blog app.
    Every Controller is wrapped with wrapController()  that handles 
    error if any error is thrown.
*/
const { wrapController } = require("../utils/asyncwrappers");
const UserService = require('../services/userService');
const JWTService = require("../services/jwtService");
const ApiResponse = require("../utils/apiMessage");

// SignUp Controller: Handles user signup request 
const signUpCTLR = wrapController(async (req, res) => {

    // creates new user using validated data through user body.

    await UserService.signUpUser(req.body);

    // sends 'User created' response.
    res.status(201)
        .json(ApiResponse.success(201));

});

// Login User Controller: Handles user login request
const loginUserCTLR = wrapController(async (req, res) => {

    // user service handles validate user login info to authenticate
    const user = await UserService.loginUser(req.body);

    // after user authentication refresh token is generated 
    const refreshToken = await JWTService.genRefresh(user);

    // unnecessary data is omitted 
    delete user?.id;
    // The data is shared to access token.
    const accessToken = await JWTService.genAccess(user);

    // response sends a cookie of refresh-token and a json object about user info along with access token.
    res.status(200)
        .cookie('refresh-token', refreshToken, { httpOnly: true, sameSite: "strict", expiry: Date.now() + 3 * 24 * 60 * 60 * 1000, secure: true })
        .json({
            user: user, access_token: accessToken
        });

});

// Logout User Controller: Handles user logout request
const logoutUserCTRL = wrapController(async (req, res) => {

    // user data is input 
    const user = req.user;

    // deletes all refresh tokens of user that is stored in database.
    await JWTService.deleteRefreshByUserID(user.id);

    // sends response as success for user log out and clears cookie
    res.status(200)
        .clearCookie('refresh-token')
        .json(ApiResponse.success(200, 'User logged out!'));
});

// Generate Refresh Controller: Handles to regenerate to sustain user sessions
const generateRefreshCTLR = wrapController(async (req, res) => {

    // gets token from cookies else throws error
    // let token = req.cookies['refresh-token'];
    // if (!token)
    //     throw new CustomError('Token missing!', 401);

    let { authorization } = req.headers;
    const token = JWTService.checkTokenHeader(authorization);

    // regenerates access and refresh token
    const { accessToken, refreshToken } = await JWTService.regenRefreshAndAccess(token);

    // sends response a cookie with refresh token and a json response of access token
    res.status(200)
        .cookie('refresh-token', refreshToken, { httpOnly: true, expiry: Date.now() + 3 * 24 * 60 * 60 * 1000, secure: true })
        .json({
            access_token: accessToken
        });

});

module.exports = { signUpCTLR, loginUserCTLR, logoutUserCTRL, generateRefreshCTLR };