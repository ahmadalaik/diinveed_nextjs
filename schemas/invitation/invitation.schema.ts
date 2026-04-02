import z from "zod";

export const invitationSchema = z.object({
  brideName: z
    .string()
    .nonempty("Bride name is required")
    .min(3, "Bride name must be minimum 8 characters"),
  brideNickname: z
    .string()
    .nonempty("Bride nickname is required")
    .min(3, "Bride nickname must be minimum 8 characters"),
  fatherBrideName: z
    .string()
    .nonempty("Father bride name is required")
    .min(3, "Father bride name must be minimum 8 characters"),
  motherBrideName: z
    .string()
    .nonempty("Mother bride name is required")
    .min(3, "Mother bride name must be minimum 8 characters"),
  brideDescription: z.string().optional(),
  groomName: z
    .string()
    .nonempty("Groom name is required")
    .min(3, "Groom name must be minimum 8 characters"),
  groomNickname: z
    .string()
    .nonempty("Groom nickname is required")
    .min(3, "Groom nickname must be minimum 8 characters"),
  fatherGroomName: z
    .string()
    .nonempty("Father groom name is required")
    .min(3, "Father groom name must be minimum 8 characters"),
  motherGroomName: z
    .string()
    .nonempty("Mother groom name is required")
    .min(3, "Mother groom name must be minimum 8 characters"),
  groomDescription: z.string().optional(),
});

export type InvitationType = z.infer<typeof invitationSchema>;
