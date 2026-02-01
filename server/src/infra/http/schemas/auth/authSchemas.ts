import z from "zod";

export const magicLinkSchema = z.object({
    email: z
        .string({ required_error: "User email is required" })
        .email({ message: "Must be a valid email address" })
});

export const loginSchema = z.object({
    token: z
       .string() 
});