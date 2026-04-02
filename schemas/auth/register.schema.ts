import z from "zod";

export const registerSchema = z.object({
  name: z.string().nonempty("Name is required").min(3, "Name must be minimum 8 characters"),
  email: z.string().nonempty("Email is required").pipe(z.email("Email is not valid")),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be minimum 8 characters"),
});

export type RegisterType = z.infer<typeof registerSchema>;
