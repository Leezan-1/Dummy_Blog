const JWTService = require("../services/jwtService");
const { wrapMiddleware } = require("../utils/asyncwrappers");

const authTokenMW = wrapMiddleware(async (req, res) => {
    const { authorization } = req.headers;

    let token = JWTService.checkTokenHeader(authorization);


    let decoded = JWTService.checkValidAccess(token);

});

module.exports = { authTokenMW }