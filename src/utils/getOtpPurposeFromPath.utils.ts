import { OtpPurpose } from "../constants/enums";
import CustomError from "./CustomError.utils";

export default function (reqPath: string) { // reqPath is req.path

    let pathSegment = reqPath.split('/')[1];

    switch (pathSegment) {
        case 'reset-password':
            return OtpPurpose.RESET;

        case 'verify-email':
            return OtpPurpose.VERIFY;

        default:
            throw new CustomError(400, `invalid otp purpose for path ${reqPath}`);
    }
}