import { z } from "zod";

const NameSchema = z.string().min(2).max(50);
const PasswordSchema = z.string().min(8).max(20);
const EmailSchema = z.string().email('invalid email');

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

export type SignUpForm = z.infer<typeof SignUpFormSchema>;
export type LoginForm = z.infer<typeof LoginFormSchema>;