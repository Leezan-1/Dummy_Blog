const JWTService = require("../services/jwtService");
const UserService = require("../services/userService");
const CustomError = require("../utils/CustomError");
const { wrapMiddleware } = require("../utils/asyncwrappers");

const authTokenMW = wrapMiddleware(async (req, res, next) => {
    // get auth token form headers
    const { authorization } = req.headers;

    // check valid access token
    let userInfo = await JWTService.checkValidAccess(authorization);

    let user = await UserService.getUserByEmail(userInfo.email);

    if (!user) {
        throw new CustomError('User not valid', 403);
    }
    req.user = user;
    req.sessionId = userInfo.sessionId;

    next();
});

module.exports = { authTokenMW }