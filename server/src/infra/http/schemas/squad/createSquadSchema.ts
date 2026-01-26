import z from "zod";

export const createSquadSchema = z.object({
    squadName: z
        .string({ required_error: "Squad name is required" })
        .min(3, { message: "Squad name must be at least 3 characters long" })
        .max(255, { message: "Squad name must be at most 50 characters long" }),

    userName: z
        .string({ required_error: "User name is required" })
        .min(4, { message: "User name must be at least 3 characters long" })
        .max(255, { message: "User name must be at most 50 characters long" }),
    
    userEmail: z
        .string({ required_error: "User email is required" })
        .email({ message: "Must be a valid email address" })
});

export type CreateSquadBody = z.infer<typeof createSquadSchema>;