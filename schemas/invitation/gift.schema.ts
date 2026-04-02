import z from "zod";

export const giftSchema = z.object({
  id: z.string(),
  provider: z.string().nonempty("Provider is required"),
  accountName: z
    .string()
    .nonempty("Account name is required")
    .min(3, "Account name must be minimum 8 characters"),
  accountNumber: z
    .string()
    .nonempty("Account number is required")
    .min(8, "Account number must be minimum 8 characters"),
  order: z.number(),
});

export type GiftType = z.infer<typeof giftSchema>;
