import { z } from "zod";
import { PasswordSchema } from "./userForm.schema";

export const PasswordFormSchema = z.object({
    oldPassword: PasswordSchema.optional(),
    newPassword: PasswordSchema,
    confirmPassword: PasswordSchema,
});

export type PasswordForm = z.infer<typeof PasswordFormSchema> 