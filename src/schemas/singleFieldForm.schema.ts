import { z } from "zod";

const titleRegex = /^[A-Za-z0-9\s\.,! ?'"-]*$/;
const tagNameRegex = /^[A-Za-z]+$/;
const otpTokenRegex = /^\d{6}$/;

export const NameSchema = z.string()
    .min(2).max(50);

export const PasswordSchema = z.string()
    .min(8).max(20);

export const EmailSchema = z.string()
    .email('invalid email');

export const TitleSchema = z.string()
    .min(10, 'must be at least 10 character long')
    .max(100, "must not exceed 100 character")
    .regex(titleRegex, "no emojis or special character allowed");

export const ExcerptSchema = z.string()
    .min(10, "excerpt must at least be 10 character long ");

export const TagSchema = z.string()
    .min(2, 'tag name must be 2 character long')
    .max(20, 'tag name must not exceed 20 character')
    .regex(tagNameRegex, 'tag must be alphabet only');

export const OtpSchema = z.string()
    .length(6, 'otp token must be 6 digits')
    .regex(otpTokenRegex, 'otp token must be 6 digits')