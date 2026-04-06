import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const gallerySchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Maximum image size is 5MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
  order: z.number(),
});

export const galleriesFormSchema = z.object({
  images: z.array(gallerySchema).min(1, "At least one event is required"),
});

export type GalleryType = z.infer<typeof gallerySchema>;
export type GalleriesFormType = z.infer<typeof galleriesFormSchema>;
