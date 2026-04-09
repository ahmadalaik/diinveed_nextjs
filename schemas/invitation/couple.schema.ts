import z from "zod";

export const coupleFormSchema = z.object({
  brideName: z.string().min(1, "Name is required"),
  brideNickname: z.string().min(1, "Nickname is required"),
  fatherBrideName: z.string().min(1, "Father name is required"),
  motherBrideName: z.string().min(1, "Mother name is required"),
  brideDescription: z.string().optional(),
  bridePhotoUrl: z.string().optional(),
  bridePhotoPublicId: z.string().optional(),

  groomName: z.string().min(1, "Name is required"),
  groomNickname: z.string().min(1, "Nickname is required"),
  fatherGroomName: z.string().min(1, "Father name is required"),
  motherGroomName: z.string().min(1, "Mother name is required"),
  groomDescription: z.string().optional(),
  groomPhotoUrl: z.string().optional(),
  groomPhotoPublicId: z.string().optional(),
});

export type CoupleFormType = z.infer<typeof coupleFormSchema>;
