const JWTService = require("../services/jwtService");
const UserService = require("../services/userService");
const { wrapMiddleware } = require("../utils/asyncwrappers");
const CustomError = require("../utils/CustomError");

const authTokenMW = wrapMiddleware(async (req, res, next) => {
    const { authorization } = req.headers;

    let token = JWTService.checkTokenHeader(authorization);
    let userInfo = await JWTService.checkValidAccess(token);

    let user = await UserService.getUserByEmail(userInfo.email);

    if (!user) {
        throw new CustomError('User not valid', 403);
    }
    req.user = user;

    next();
});

module.exports = { authTokenMW }