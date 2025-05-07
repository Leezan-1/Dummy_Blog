import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

enum OtpPurpose {
    reset = "reset-password",
    verify = "verify-email"
}
interface OtpDB {
    token: string // key,
    jwtToken: string // jwt token has expiry, email of user so no necessary 
    purpose: OtpPurpose // enum for either "reset-password" or "verify-email"
}

export const OTP: OtpDB = {
    token: "119534",
    jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RpbmdAdGVzdC5jb20iLCJpYXQiOjE3NDY1MjIzMTMsImV4cCI6MTc0NjU0MDMxM30.rhOaTSbwEgxsRL_pr43aLNUpSHY0EbW5_SOSoGBDK68",
    purpose: OtpPurpose.reset
}

export async function findOne(token: string) {
    if (token === OTP.token) {
        return OTP
    }
    return null;
}

// console.log('jwt.sign({},process.env.OTP_TOKEN_SECRET!) :>> ', jwt.sign({ email: "testing@test.com" }, process.env.OTP_TOKEN_SECRET!, { expiresIn: "5h" }));