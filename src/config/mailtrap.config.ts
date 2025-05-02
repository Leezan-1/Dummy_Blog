import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const MAIL_OPTIONS = {
    from: `'BlogPost' <no-reply@${process.env.APP_NAME}>`,
    subject: 'reset password',
    text: `Your OTP token is`
};

export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST!,
    port: parseInt(process.env.MAIL_PORT!),
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME!,
        pass: process.env.MAIL_PASSWORD!
    },
    disableFileAccess: true,
    disableUrlAccess: true

});


/*
MAIL_MAILER
MAIL_HOST
MAIL_PORT
MAIL_USERNAME
MAIL_PASSWORD

MAIL_API_TOKEN


 */