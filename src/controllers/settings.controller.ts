import { AuthService } from "../services/Auth.service";
import { apiSuccessMsg } from "../utils/apiMessage.utils";
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";

export const resetPasswordCTLR = wrapRequestFunction(async (req, res) => {

    await AuthService.sendOtpToken(req.body?.email);

    // response
    const responseCode = 200;
    const responseMsg = apiSuccessMsg(responseCode, 'token successfully sent to given email');
    res.status(responseCode).json(responseMsg);
});

export const validateOtpCTLR = wrapRequestFunction(async (req, res) => {

    const resData = await AuthService.checkOtpToken(req.body?.email, req.body?.otpToken);

    // response 
    const responseCode = 200;
    const responseMsg = apiSuccessMsg(responseCode, 'token is valid, checked successfully', resData);
    res.status(responseCode).json(responseMsg);
});

export const regeneratePasswordCTLR = wrapRequestFunction(async (req, res) => {

    await AuthService.newPassword(req.body);

    // response
    const responseCode = 201;
    res.status(responseCode).json(apiSuccessMsg(responseCode, 'new password created'));
});