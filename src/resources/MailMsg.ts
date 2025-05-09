import { SendMailOptions } from "nodemailer";

export const makeOtpMail = (email: string, otpToken: number) => {
    const MAIL_MSG: SendMailOptions = {
        from: `'BlogPost' <no-reply@${process.env.APP_NAME}>`,
        to: email,
        subject: 'reset password',
        text: `Your OTP token is ${otpToken}`
    };
    return MAIL_MSG;
}