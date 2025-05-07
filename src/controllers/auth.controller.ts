// built-in & third party modules

// schemas, interfaces & enums
import { CookieOptions } from "express";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";
import { EmailSchema, LoginFormSchema, SignUpFormSchema } from "../schemas/userForm.schema";

// models and services
import AuthService from "../services/Auth.service";
import JWTService from "../services/JWT.service";

// utility functions & classes
import { apiSuccessMsg } from "../utils/apiMessage.utils";
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";


const COOKIE_OPTIONS: CookieOptions = {
    signed: true,
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
};

export const signUpCTLR = wrapRequestFunction(async (req, res) => {

    let parsedBody = SignUpFormSchema.parse(req.body);

    // creates a new user through the user signup form
    await AuthService.signUpUser(parsedBody);

    //response
    const responseCode = 201;
    const responseMsg = apiSuccessMsg(responseCode, "new user created");
    res.status(responseCode).json(responseMsg);
});

export const loginUserCTLR = wrapRequestFunction(async (req, res) => {

    let parsedBody = LoginFormSchema.parse(req.body);
    // gets the user information after login
    const user = await AuthService.loginUser(parsedBody);
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

    await AuthService.sendOtpToken(req.body?.email);

    // response
    const responseCode = 200;
    const responseMsg = apiSuccessMsg(responseCode, 'token successfully sent to given email');
    res.status(responseCode).json(responseMsg);
});

export const regeneratePasswordCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    // req.body should have email , otp token
    await AuthService.resetPassword(req.body, req?.user?.id!);

    // response
    const responseCode = 201;
    res.status(responseCode).json(apiSuccessMsg(responseCode, 'new password created'));
});
