import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "username must be at 4 charecters")
  .max(10, "username should not more 10 charecters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "username should not contain any special charecters"
  );

export const signUpSchemaValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, "password must be at 4 charecters")
    .max(12, "password should not more 10 charecters"),
});
