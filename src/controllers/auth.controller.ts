// built-in & third party modules

// constants and enums
import { OtpPurpose } from "../constants/enums";
import { COOKIE_OPTIONS } from "../constants/Variables";
// schemas, interfaces & enums
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";
import { LoginFormSchema, SignUpFormSchema } from "../schemas/multipleFieldsForm.schema";

// models and services
import AuthService from "../services/Auth.service";
import JWTService from "../services/Jwt.service";
import OtpService from "../services/Otp.service";

// utility functions & classes
import { apiSuccessMsg } from "../utils/apiMessage.utils";
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";

export const signUpCTLR = wrapRequestFunction(async (req, res) => {

    let parsedBody = SignUpFormSchema.parse(req.body);

    // creates a new user through the user signup form
    let newUser = await AuthService.signUpUser(parsedBody);
    OtpService.sendOtpToken(OtpPurpose.VERIFY, parsedBody.email, newUser);

    //response
    const responseCode = 201;
    const responseMsg = apiSuccessMsg(responseCode, "new user created successfully and otp sent to the email to verify");
    res.status(responseCode).json(responseMsg);
});

// changes the emails as verified
export const verifyEmailCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {


    // req.user taken through AuthenticatedRequest
    // this function needs user id and req.body
    await AuthService.verifyEmail(req.user?.id!, req.body?.email);


    //response
    const responseCode = 200;
    const responseMsg = apiSuccessMsg(responseCode, "user verified successfully");
    res.status(responseCode).json(responseMsg);

    // await 
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

export const forgotPasswordCTLR = wrapRequestFunction(async (req, res) => {

    await OtpService.sendOtpToken(OtpPurpose.RESET, req.body?.email);

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
