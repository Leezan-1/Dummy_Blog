// built-in & third party modules
import jwt from 'jsonwebtoken';

// schemas, interfaces & enums
import { JwtPayload } from "jsonwebtoken";
import { OtpPurpose } from "../constants/enums";

// models and services
import { Otp } from "../models/Otp";

// utility functions & classes
import CustomError from "../utils/CustomError.utils";
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";
import AuthenticatedRequest from '../interfaces/AuthenticatedRequest.interface';

export const verifyOtpMW = wrapRequestFunction(async (req: AuthenticatedRequest, res, next) => {

    let { otpToken } = req.body;
    let payload: JwtPayload;

    const dbToken = await Otp.findOne({ where: { token: otpToken, purpose: OtpPurpose.RESET } });

    if (!dbToken)
        throw new CustomError(400, "invalid otp token");

    try {
        payload = jwt.verify(dbToken.jwtToken, process.env.OTP_TOKEN_SECRET!, { complete: false }) as JwtPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            dbToken.destroy(); //deletes otp token  from database if exceeds time

            throw new CustomError(406, "otp token expired!")
        }
        throw error;
    }
    req.user = {
        id: payload?.id,
        username: payload?.username
    };
    next();
});