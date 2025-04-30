import { CookieOptions } from "express";
import { AuthService } from "../services/Auth.service";
import { apiSuccessMsg } from "../utils/apiMessage.utils";
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";
import JWTService from "../services/JWT.service";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";

const COOKIE_OPTIONS: CookieOptions = {
    signed: true,
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
};

export const signUpCTLR = wrapRequestFunction(async (req, res) => {
    // creates a new user through the user signup form
    await AuthService.signUpUser(req.body);

    //response
    const responseCode = 201;
    const responseMsg = apiSuccessMsg(responseCode, "new user created");
    res.status(responseCode).json(responseMsg);
});

export const loginUserCTLR = wrapRequestFunction(async (req, res) => {

    // gets the user information after login
    const user = await AuthService.loginUser(req.body);
    // generates new tokens pair for user session
    const newToken = await JWTService.generateNewTokenPair(user.id, user.username);

    //response
    const responseCode = 200;
    const responseMsg = apiSuccessMsg(responseCode, "user logged in", { access_token: newToken.access_token });
    res.status(responseCode).cookie("refresh-token", newToken.refresh_token, COOKIE_OPTIONS).json(responseMsg);
});

export const logoutUserCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    const user = req.user!;
    const tokenId = req.sessionId!;

    await JWTService.deleteTokenPairByUserId(user.id, tokenId);

    // response
    const responseCode = 200;
    const responseMsg = apiSuccessMsg(responseCode, "user logged out");
    res.status(responseCode).json(responseMsg,);
});

export const generateRefreshCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    // gets the refresh token cookie from the user's request
    let prevRefreshToken = req.signedCookies['refresh-token'];

    // regenerate new token pair
    const newToken = await JWTService.regenerateNewTokenPair(prevRefreshToken);
    // response
    const responseCode = 201;
    const responseMsg = apiSuccessMsg(responseCode, "new tokens pair generated", { access_token: newToken.access_token });
    res.status(responseCode).cookie('refresh-token', newToken.refresh_token, COOKIE_OPTIONS).json(responseMsg);
});

export const resetPasswordCTLR = wrapRequestFunction(async (req, res) => {

    let email = req.body?.email;

    await AuthService.sendOtpToken(email);

    // response
    const responseCode = 200;
    const responseMsg = apiSuccessMsg(responseCode, 'token successfully sent to given email');
    res.status(responseCode).json(responseMsg);
});

export const validateOtpCTLR = wrapRequestFunction(async (req, res) => {

    let email = req.body?.email;
    let token = req.body?.otpToken;

    await AuthService.checkOtpToken(email, token);

    // response 
    const responseCode = 200;
    const responseMsg = apiSuccessMsg(responseCode, 'token is valid, checked successfully');
    res.status(responseCode).json(responseMsg);
});

export const regeneratePasswordCTLR = wrapRequestFunction(async (req, res) => {

    await AuthService.newPassword(req.body);

    // response
    const responseCode = 201;
    res.status(responseCode).json(apiSuccessMsg(responseCode, 'new password created'));
});
