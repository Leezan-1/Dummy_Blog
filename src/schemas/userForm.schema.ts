// built-in & third party modules
import { z } from "zod";

export const NameSchema = z.string().min(2).max(50);
export const PasswordSchema = z.string().min(8).max(20);
export const EmailSchema = z.string().email('invalid email');

export const SignUpFormSchema = z.object({
    fname: NameSchema,
    lname: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
})

export const LoginFormSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema
});

export const RegenPasswordSchema = z.object({
    email: EmailSchema,
    oldPassword: PasswordSchema,
    newPassword: PasswordSchema
})

export type SignUpForm = z.infer<typeof SignUpFormSchema>;
export type LoginForm = z.infer<typeof LoginFormSchema>;