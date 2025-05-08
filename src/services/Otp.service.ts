// built-in & third party modules
import jwt, { JwtPayload } from 'jsonwebtoken';

// configs and resources
import { makeOtpMail } from "../resources/MailMsg";
import { transporter } from "../config/mailtrap.config";

// schemas, interfaces & enums
import { OtpPurpose } from '../constants/enums';
import { EmailSchema } from '../schemas/singleFieldForm.schema';

// models and services
import { Otp } from "../models/Otp";
import { User } from "../models/User";

// utility functions & classes
import CustomError from "../utils/CustomError.utils";
import { generateOTPToken } from "../utils/generate.utils";

// controllers 
// middlewares

class OtpService {

    static async sendOtpToken(userEmail: string) {

        if (!await transporter.verify())
            throw new CustomError(500, "unable connect to mail server");

        const parsedEmail = EmailSchema.parse(userEmail);

        const destinationUser = await User.findOne({ where: { email: parsedEmail } });

        if (!destinationUser)
            return;

        const otpToken = generateOTPToken();

        const info = transporter.sendMail(makeOtpMail(destinationUser.email, otpToken));

        // jwt here
        const jwtForOtp = jwt.sign(
            {
                id: destinationUser.id,
                username: destinationUser.username
            },
            process.env.OTP_TOKEN_SECRET!,
            { expiresIn: '15m' }
        );

        await Otp.create({
            token: otpToken,
            jwtToken: jwtForOtp,
            purpose: OtpPurpose.RESET
        });
    }

    static async verifyOtpToken(otpToken: string) {
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

        return payload;
    }
}

export default OtpService;