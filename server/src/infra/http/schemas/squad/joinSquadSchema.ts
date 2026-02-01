import z from "zod";

export const joinSquadSchema = z.object({
    userName: z
        .string({ required_error: "User name is required" })
        .min(4, { message: "User name must be at least 4 characters long" })
        .max(255, { message: "User name must be at most 255 characters long" }),
        
    userEmail: z
        .string({ required_error: "User email is required" })
        .email({ message: "Must be a valid email address" }),

    squadCode: z
        .string({ required_error: "Squad code is required" })
        .length(6, { message: "Squad code must be exactly 6 characters long" })
})