import z from "zod";

export const createSquadSchema = z.object({
    userEmail: z
        .string({ required_error: "User email is required" })
        .email({ message: "Must be a valid email address" }),

    userName: z
        .string({ required_error: "User name is required" })
        .min(4, { message: "User name must be at least 3 characters long" })
        .max(255, { message: "User name must be at most 255 characters long" }),

    squadName: z
        .string({ required_error: "Squad name is required" })
        .min(3, { message: "Squad name must be at least 3 characters long" })
        .max(255, { message: "Squad name must be at most 50 characters long" })
});

export const joinSquadSchema = z.object({
    squadCode: z
        .string({ required_error: "Squad code is required" })
        .length(6, { message: "Squad code must be exactly 6 characters long" }),

    userEmail: z
        .string({ required_error: "User email is required" })
        .email({ message: "Must be a valid email address" }),

    userName: z
        .string({ required_error: "User name is required" })
        .min(4, { message: "User name must be at least 4 characters long" })
        .max(255, { message: "User name must be at most 255 characters long" })
})