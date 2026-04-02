import z from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").pipe(z.email("Email is not valid")),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be minimum 8 characters"),
});

export type LoginType = z.infer<typeof loginSchema>;
