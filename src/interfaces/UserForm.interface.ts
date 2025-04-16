import { Request } from "express";

type RequestBody = Request['body'];

interface UserForm {
    fname: string,
    lname: string,
    email: string,
    password: string,
}


// export type SignUpForm = Required<UserForm>;
export type SignUpForm = Required<UserForm>;
// export type SignUpForm = Pick<RequestBody, "first_name" | "last_name" | "email" | "password">;
export type LoginForm = Pick<UserForm, "email" | "password">;