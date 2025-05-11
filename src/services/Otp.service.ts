// built-in & third party modules
import jwt, { JwtPayload } from "jsonwebtoken";

// configs and resources
import { makeOtpMail } from "../resources/MailMsg";
import { transporter } from "../config/mailtrap.config";

// schemas, interfaces & enums
import { OtpPurpose } from "../constants/enums";
import { EmailSchema, OtpSchema } from "../schemas/singleFieldForm.schema";

// models and services
import { Otp } from "../models/Otp";
import { User } from "../models/User";

// utility functions & classes
import CustomError from "../utils/CustomError.utils";
import { generateOTPToken } from "../utils/generate.utils";


class OtpService {

    static async sendOtpToken(otpPurpose: string, userEmail: string, destinationUser?: User | null) {
        if (!await transporter.verify())
            throw new CustomError(500, "unable connect to mail server");

        // let destinationUser: User | null;

        if (!destinationUser) { }
        const parsedEmail = EmailSchema.parse(userEmail);
        destinationUser = await User.findOne({
            where: { email: parsedEmail },
        });

        if (!destinationUser) return;

        const otpToken = generateOTPToken();

        // send email
        transporter.sendMail(
            makeOtpMail(destinationUser.email, otpToken)
        );

        // jwt here
        const jwtForOtp = jwt.sign(
            {
                id: destinationUser.id,
                email: destinationUser.email,
                username: destinationUser.username,
            },
            process.env.OTP_TOKEN_SECRET!,
            { expiresIn: "15m" }
        );

        await Otp.create({
            token: otpToken,
            jwtToken: jwtForOtp,
            purpose: otpPurpose,
        });
    }

    static async verifyOtpToken(otpToken: string, otpPurpose: string) {
        let parsedOtpToken = OtpSchema.parse(otpToken);

        let payload: JwtPayload;

        const dbToken = await Otp.findOne({
            where: { token: parsedOtpToken, purpose: otpPurpose },
        });

        if (!dbToken) throw new CustomError(400, "invalid otp token");

        try {
            payload = jwt.verify(dbToken.jwtToken, process.env.OTP_TOKEN_SECRET!, {
                complete: false,
            }) as JwtPayload;

        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                dbToken.destroy(); //deletes otp token  from database if exceeds time

                throw new CustomError(406, "otp token expired!");
            }
            throw error;
        }

        return payload;
    }
}

export default OtpService;
