import { NextFunction, Response } from "express";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";
import JWTService from "../services/JWT.service";
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";


export const authTokenMW = wrapRequestFunction(async (req: AuthenticatedRequest, res, next) => {

    const { authorization } = req.headers;

    const userInfo = await JWTService.checkValidAccess(authorization!);

    req.user = {
        id: userInfo.uid,
        username: userInfo.username
    };
    req.sessionId = userInfo.jti!;


    next();
});