// built-in & third party modules
import jwt from 'jsonwebtoken';

// configs and resources 
import { transporter } from "../config/mailtrap.config";

// schemas, interfaces & enums
import { OtpPurpose } from '../enums/OtpPurpose.enum';
import { EmailSchema, LoginForm, LoginFormSchema, NameSchema, RegenPasswordSchema, SignUpForm, SignUpFormSchema } from "../schemas/userForm.schema";
import { PasswordForm, PasswordFormSchema } from '../schemas/passowrdForm.schema';

// models and services
import { User } from "../models/User";
import { Otp } from "../models/Otp";

// utility functions & classes
import CustomError from "../utils/CustomError.utils";
import { makeOtpMail } from "../resources/MailMsg";
import { checkUserPassword, generateOTPToken, generatePassword } from "../utils/generate.utils";


export class AuthService {
    static async getUserByEmail(email: string): Promise<User> {

        // user generated by this function is used all over the server.
        const user = await User.findOne({ where: { email: email } });
        if (!user)
            throw new CustomError(401, "user does not exist");
        return user;
    }

    static async getUserById(id: number) {
        const user = await User.findByPk(id);
        if (!user)
            throw new CustomError(401, "user does not exist");
        return user;
    }

    // signs up a new user
    static async signUpUser(signupInfo: SignUpForm) {

        let { fname, lname, email, password } = SignUpFormSchema.parse(signupInfo);

        // checks if there is any other user with same email address.
        const existingUser = await User.findOne({ where: { email: email }, raw: true });
        if (existingUser)
            throw new CustomError(401, "user already exists");

        // stores hashed password for user.
        let hashedPassword = await generatePassword(password);

        // auto generates username for new user
        let username = email.split("@")[0];

        // creates a new user.
        await User.create({
            first_name: fname,
            last_name: lname,
            username: username,
            email: email,
            password: hashedPassword
        });
    }

    static async loginUser(loginInfo: LoginForm) {

        let { email, password } = LoginFormSchema.parse(loginInfo);

        // checks the email and password of the user in database
        let existingUser = await this.getUserByEmail(email);

        if (!existingUser || ! await checkUserPassword(password, existingUser.password))
            throw new CustomError(403, "email or password did not match");

        return existingUser;
    }

    static async sendOtpToken(userEmail: string) {

        const parsedEmail = EmailSchema.parse(userEmail);

        try {
            const destinationUser = await this.getUserByEmail(parsedEmail);
            if (!await transporter.verify())
                throw new CustomError(500, "unable connect to mail server");

            const otpToken = generateOTPToken();

            const info = transporter.sendMail(makeOtpMail(destinationUser.email, otpToken));

            // jwt here
            const jwtForOtp = jwt.sign(
                {
                    id: destinationUser.id,
                    username: destinationUser.username
                },
                process.env.OTP_TOKEN_SECRET!,
                { expiresIn: '10m' }
            );

            await Otp.create({
                token: otpToken,
                jwtToken: jwtForOtp,
                purpose: OtpPurpose.RESET
            });
        } catch (error) {
            if (error instanceof CustomError && error.code == 500)
                throw error;
        }
    }

    static async resetPassword(newPasswordFields: PasswordForm, userId: number) {

        let { newPassword, confirmPassword } = PasswordFormSchema.parse(newPasswordFields);


        const user = await this.getUserById(userId);

        user.update({ password: await generatePassword(newPassword) });

    }
}

export default AuthService;