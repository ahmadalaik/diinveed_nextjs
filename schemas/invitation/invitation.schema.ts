import z from "zod";

const uploadedImageSchema = z
  .object({
    url: z.url(),
    publicId: z.string(),
  })
  .optional();

export const invitationSchema = z.object({
  bridePhoto: uploadedImageSchema,
  brideName: z.string().min(1, "Bride name is required"),
  brideNickname: z.string().min(1, "Bride nickname is required"),
  fatherBrideName: z.string().min(1, "Father bride name is required"),
  motherBrideName: z.string().min(1, "Mother bride name is required"),
  brideDescription: z.string().optional(),

  groomPhoto: uploadedImageSchema,
  groomName: z.string().min(1, "Groom name is required"),
  groomNickname: z.string().min(1, "Groom nickname is required"),
  fatherGroomName: z.string().min(1, "Father groom name is required"),
  motherGroomName: z.string().min(1, "Mother groom name is required"),
  groomDescription: z.string().optional(),
});

export type InvitationType = z.infer<typeof invitationSchema>;
