/*
    This handles authentication controllers for blog app.
    Every Controller is wrapped with wrapController()  that handles 
    error if any error is thrown.
*/
const { wrapController } = require("../utils/asyncwrappers");
const UserService = require('../services/userService');
const JWTService = require("../services/jwtService");
const ApiResponse = require("../utils/apiMessage");

const COOKIE_OPTIONS = {
    signed: true,
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    expiry: Date.now() + 3 * 24 * 60 * 60 * 60 * 1000
}
// SignUp Controller: Handles user signup request 
const signUpCTLR = wrapController(async (req, res) => {

    // creates new user using validated data through user body.

    await UserService.signUpUser(req.body);

    // sends 'User created' response.
    const responseCode = 201;
    const responseData = ApiResponse.success(responseCode);
    res.status(responseCode).json(responseData);

});

// Login User Controller: Handles user login request
const loginUserCTLR = wrapController(async (req, res) => {

    // user service handles validate user login info to authenticate
    const user = await UserService.loginUser(req.body);

    // after user authentication refresh token is generated 
    const { refreshToken, accessToken } = await JWTService.generateNewTokenPair(user);

    // response sends a cookie of refresh-token and a json object about user info along with access token.
    const responseData = ApiResponse.success(200, 'User Logged In', { access_token: accessToken })
    res.status(200)
        .cookie('refresh-token', refreshToken, COOKIE_OPTIONS)
        .json(responseData);

});

// Logout User Controller: Handles user logout request
const logoutUserCTRL = wrapController(async (req, res) => {
    const user = req.user;
    const tokenId = req.sessionId;

    // deletes all refresh tokens of user that is stored in database.
    await JWTService.deleteRefreshByUserID(user.id, tokenId);

    // sends response as success for user log out and clears cookie
    const responseData = ApiResponse.success(200, 'User logged out!');
    res.status(200)
        .clearCookie('refresh-token')
        .json(responseData);
});

// Generate Refresh Controller: Handles to regenerate to sustain user sessions
const generateRefreshCTLR = wrapController(async (req, res) => {

    // get refresh token from cookies else throws error
    let prevRefreshToken = req.signedCookies['refresh-token'];

    // let { authorization } = req.headers;
    // const token = JWTService.checkTokenHeader(authorization);

    // regenerates access and refresh token
    const { accessToken, refreshToken } = await JWTService.regenerateTokenPair(prevRefreshToken);

    // sends response a cookie with refresh token and a json response of access token
    const responseData = ApiResponse.success(201, 'New Tokens Pair Generated!', { access_token: accessToken })
    res.status(200)
        .cookie('refresh-token', refreshToken, COOKIE_OPTIONS)
        .json(responseData);

});

module.exports = { signUpCTLR, loginUserCTLR, logoutUserCTRL, generateRefreshCTLR };