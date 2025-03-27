const JWTService = require("../services/jwtService");
const UserService = require("../services/userService");
const CustomError = require("../utils/CustomError");
const { wrapMiddleware } = require("../utils/asyncwrappers");

const authTokenMW = wrapMiddleware(async (req, res, next) => {
    // get auth token form headers
    const { authorization } = req.headers;

    // check valid access token
    let userInfo = await JWTService.checkValidAccess(authorization);

    // let user = await UserService.getUserById(userInfo.sub);

    // if (!user) {
    //     throw new CustomError('Invalid Access Token', 401);
    // }
    req.user = {
        id: userInfo.sub,
        username: userInfo.username
    };
    req.sessionId = userInfo.session_id;

    // if (req.params?.username) {
    //     if (user.username != req.params?.username) {
    //         throw new CustomError('Unauthorized User Accessing Route!', 401)
    //     }
    // }

    next();
});

module.exports = { authTokenMW }