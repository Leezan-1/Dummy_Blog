// built-in & third party modules

// schemas, interfaces & enums
import { OtpPurpose } from "../constants/enums";

// models and services

// utility functions & classes
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";
import AuthenticatedRequest from '../interfaces/AuthenticatedRequest.interface';
import OtpService from '../services/Otp.service';
import getOtpPurpose from "../utils/getOtpPurposeFromPath.utils";
import CustomError from "../utils/CustomError.utils";

export const verifyOtpMW = wrapRequestFunction(async (req: AuthenticatedRequest, res, next) => {

    let { otpToken } = req.body;

    // if path is of reset-password then otp's purpose is reset-password
    let otpPurpose = getOtpPurpose(req.path);

    let payload = await OtpService.verifyOtpToken(otpToken, otpPurpose);

    req.user = {
        id: payload?.id,
        email: payload?.email,
        username: payload?.username
    };

    if (req.body?.email) {
        if (req.body?.email !== payload?.email)
            throw new CustomError(406, "invalid otp for given email!");
    }

    next();
});