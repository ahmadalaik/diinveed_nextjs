import z from "zod";

export const invitationInfoSchema = z.object({
  brideName: z.string().min(1, "Bride name is required"),
  brideNickname: z.string().min(1, "Bride nickname is required"),
  fatherBrideName: z.string().min(1, "Father bride name is required"),
  motherBrideName: z.string().min(1, "Mother bride name is required"),
  brideDescription: z.string().nullable(),
  bridePhotoUrl: z.string().nullable(),
  bridePhotoPublicId: z.string().nullable(),

  groomName: z.string().min(1, "Groom name is required"),
  groomNickname: z.string().min(1, "Groom nickname is required"),
  fatherGroomName: z.string().min(1, "Father groom name is required"),
  motherGroomName: z.string().min(1, "Mother groom name is required"),
  groomDescription: z.string().nullable(),
  groomPhotoUrl: z.string().nullable(),
  groomPhotoPublicId: z.string().nullable(),
});

export type InvitationInfoType = z.infer<typeof invitationInfoSchema>;
