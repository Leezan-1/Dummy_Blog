import { z } from "zod";
import { PasswordSchema } from "../schemas/singleFieldForm.schema";
import { LoginFormSchema, PasswordFormSchema, SignUpFormSchema } from "../schemas/multipleFieldsForm.schema";

export interface PostForm {
    title: string,
    excerpt: string,
    tags: string | string[],
    description: string;
}

// interface UserForm {
//     fname: string,
//     lname: string,
//     email: string,
//     password: string,
// }
// // export type SignUpForm = Required<UserForm>;
// export type SignUpForm = Required<UserForm>;
// // export type SignUpForm = Pick<RequestBody, "first_name" | "last_name" | "email" | "password">;
// export type LoginForm = Pick<UserForm, "email" | "password">;

export type SignUpForm = z.infer<typeof SignUpFormSchema>;

export type LoginForm = z.infer<typeof LoginFormSchema>;

export type PasswordForm = z.infer<typeof PasswordFormSchema>;