import z from "zod";

export const gallerySchema = z.object({
  imageUrl: z.string(),
  order: z.number(),
});

export type GalleryType = z.infer<typeof gallerySchema>;
