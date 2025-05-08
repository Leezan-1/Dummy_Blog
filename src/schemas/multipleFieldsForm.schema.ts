import { z } from "zod";
import { EmailSchema, ExcerptSchema, NameSchema, PasswordSchema, TagSchema, TitleSchema } from "./singleFieldForm.schema";

export const PasswordFormSchema = z.object({
    oldPassword: PasswordSchema.optional(),
    newPassword: PasswordSchema,
    confirmPassword: PasswordSchema,
});

export const PostFormSchema = z.object({
    title: TitleSchema,
    excerpt: ExcerptSchema,
    tags: z.union([TagSchema, z.array(TagSchema)]).optional()
});

export const SignUpFormSchema = z.object({
    fname: NameSchema,
    lname: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
});

export const LoginFormSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema
});

