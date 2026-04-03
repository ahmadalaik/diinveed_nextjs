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

export const storiesFormSchema = z.object({
  stories: z.array(storySchema).min(1, "At least one story is required"),
});

export type StoryType = z.infer<typeof storySchema>;
export type StoriesFormType = z.infer<typeof storiesFormSchema>;
