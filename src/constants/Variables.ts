import { CookieOptions } from "express";

export const COOKIE_OPTIONS: CookieOptions = {
    signed: true,
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
};

