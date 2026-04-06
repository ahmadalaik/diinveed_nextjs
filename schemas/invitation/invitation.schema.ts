import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const imageValidation = z
  .instanceof(File)
  .refine((file) => {
    if (!file) return true; // optional
    return file.size <= MAX_FILE_SIZE;
  }, "Maximum file size is 5MB.")
  .refine((file) => {
    if (!file) return true;
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
  .optional();

export const invitationSchema = z.object({
  bridePhoto: imageValidation,
  brideName: z.string().min(1, "Bride name is required"),
  brideNickname: z.string().min(1, "Bride nickname is required"),
  fatherBrideName: z.string().min(1, "Father bride name is required"),
  motherBrideName: z.string().min(1, "Mother bride name is required"),
  brideDescription: z.string().optional(),

  groomPhoto: imageValidation,
  groomName: z.string().min(1, "Groom name is required"),
  groomNickname: z.string().min(1, "Groom nickname is required"),
  fatherGroomName: z.string().min(1, "Father groom name is required"),
  motherGroomName: z.string().min(1, "Mother groom name is required"),
  groomDescription: z.string().optional(),
});

export type InvitationType = z.infer<typeof invitationSchema>;
