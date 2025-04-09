const JWTService = require("../services/JWTService");
const { CustomError } = require("../utils");
const { wrapMiddleware } = require("../utils/asyncwrappers");

const authTokenMW = wrapMiddleware(async (req, res, next) => {
    // get auth token form headers
    const { authorization } = req.headers;

    // check valid access token
    let userInfo = await JWTService.checkValidAccess(authorization);

    // let user = await AuthService.getUserById(userInfo.sub);

    // if (!user) {
    //     throw new CustomError('Invalid Access Token', 401);
    // }
    req.user = {
        id: userInfo.sub,
        username: userInfo.username
    };
    req.sessionId = userInfo.session_id;

    // if route has username it checks here with the auth token username
    // if the user is the same of auth token.
    if (req.params?.username) {

        // username should start with @
        if (!req.params?.username.startsWith("@")) {
            throw new CustomError("Route not found!", 404);
        }

        // username is checked here with auth token's username
        if (userInfo.username !== req.params?.username.split('@')[1]) {
            throw new CustomError('User not found!', 404)
        }
    }

    next();
});

module.exports = { authTokenMW }