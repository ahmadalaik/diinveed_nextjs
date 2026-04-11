"use server";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { storiesFormSchema, StoriesFormType } from "@/schemas/invitation/story.schema";

type StoryActionResponse = {
  success?: boolean;
  errors?: {
    index?: number;
    title?: string[];
    date?: string[];
    description?: string[];
    _form?: string[];
  }[];
};

export async function createStoryAction(data: StoriesFormType): Promise<StoryActionResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, errors: [{ _form: ["Unauthorized. Please login first."] }] };
  }

  const invitation = await prisma.invitation.findUnique({ where: { userId: user.id } });
  if (!invitation) {
    return { success: false, errors: [{ _form: ["Invitation not been created"] }] };
  }

  const parsed = storiesFormSchema.safeParse(data);
  if (!parsed.success) {
    const flattenErrors = parsed.error.flatten().fieldErrors;

    if (flattenErrors.stories) {
      return { errors: [{ _form: flattenErrors.stories }] };
    }

    type StoryError = {
      index: number;
      errors: Record<string, string[] | undefined>;
    };
    const errorMap = new Map<number, StoryError>();

    Object.keys(flattenErrors).forEach((key) => {
      const match = key.match(/^stories\.(\d+)\.(.+)$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];

        if (!errorMap.has(index)) {
          errorMap.set(index, { index, errors: {} });
        }

        const storyError = errorMap.get(index);
        if (storyError) {
          storyError.errors[field] = flattenErrors[key as keyof typeof flattenErrors];
        }
      }
    });

    return {
      success: false,
      errors: [...Array.from(errorMap.values())],
    };
  }

  try {
    // discard id from fe
    const storiesData = parsed.data.stories.map(({ id: _, ...story }) => ({
      ...story,
      invitationId: invitation.id,
    }));

    await prisma.story.createMany({
      data: storiesData,
    });

    return { success: true };
  } catch (error) {
    console.log("Create Story Error: ", error);

    return {
      success: false,
      errors: [{ _form: ["Something went wrong, please try again"] }],
    };
  }
}

export async function updateStoryAction(data: StoriesFormType): Promise<StoryActionResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, errors: [{ _form: ["Unauthorized. Please login first."] }] };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    include: { stories: true },
  });
  if (!invitation) {
    return { success: false, errors: [{ _form: ["Invitation not been created"] }] };
  }

  if (invitation.stories.length === 0) {
    return { success: false, errors: [{ _form: ["Invitation story not been created"] }] };
  }

  console.log("stories payload: ", data);

  const parsed = storiesFormSchema.safeParse(data);
  if (!parsed.success) {
    const flattenErrors = parsed.error.flatten().fieldErrors;

    if (flattenErrors.stories) {
      return { errors: [{ _form: flattenErrors.stories }] };
    }

    type StoryError = {
      index: number;
      errors: Record<string, string[] | undefined>;
    };
    const errorMap = new Map<number, StoryError>();

    Object.keys(flattenErrors).forEach((key) => {
      const match = key.match(/^stories\.(\d+)\.(.+)$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];

        if (!errorMap.has(index)) {
          errorMap.set(index, { index, errors: {} });
        }

        const storyError = errorMap.get(index);
        if (storyError) {
          storyError.errors[field] = flattenErrors[key as keyof typeof flattenErrors];
        }
      }
    });

    return {
      success: false,
      errors: [...Array.from(errorMap.values())],
    };
  }

  console.log("stories parsed data: ", parsed.data.stories);

  try {
    const activeIds = parsed.data.stories.map((s) => s.id);

    await prisma.$transaction(async (tx) => {
      // delete story that are NOT in activeIds list
      await tx.story.deleteMany({
        where: {
          invitationId: invitation.id,
          id: { notIn: activeIds },
        },
      });

      const upserts = parsed.data.stories.map(({ id, ...story }) => {
        return tx.story.upsert({
          // checking id story and invitation id
          where: {
            id,
            invitationId: invitation.id,
          },
          // if match (id story retrieve from db) -> update
          update: { ...story },
          // if didn't match (id story retrieve from fe) -> create new
          create: {
            ...story,
            invitationId: invitation.id,
          },
        });
      });

      await Promise.all(upserts);
    });

    return { success: true };
  } catch (error) {
    console.log("Update Invitation Story Error: ", error);

    return {
      success: false,
      errors: [{ _form: ["Something went wrong, please try again"] }],
    };
  }
}
