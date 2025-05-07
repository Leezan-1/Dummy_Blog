// schemas, interfaces & enums
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";
// models and services
import JWTService from "../services/JWT.service";
// utility functions & classes
import CustomError from "../utils/CustomError.utils";
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";


export const authTokenMW = wrapRequestFunction(async (req: AuthenticatedRequest, res, next) => {

    const { authorization } = req.headers;

    const userInfo = await JWTService.checkValidAccess(authorization!);

    req.user = {
        id: userInfo.uid,
        username: userInfo.sub!
    };
    req.sessionId = userInfo.jti!;

    // this part handles the request that has :uname parameter
    const username = req.params?.uname
    if (username) {

        if (!username.startsWith("@"))
            throw new CustomError(404, "route not found");

        if (userInfo.sub !== username.split("@")[1])
            throw new CustomError(404, "user not found");
    }

    next();
});