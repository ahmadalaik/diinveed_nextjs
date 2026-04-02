import z from "zod";

export const storySchema = z.object({
  id: z.string(),
  title: z.string().nonempty("Title is required").min(3, "Title is too short"),
  date: z.iso.datetime({ error: "Date is required" }),
  description: z
    .string()
    .nonempty("Description is required")
    .min(3, "Description is too short"),
  order: z.number(),
});

export type StoryType = z.infer<typeof storySchema>;
