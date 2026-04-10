"use server";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { eventsFormSchema, EventsFormType } from "@/schemas/invitation/event.schema";

type EventActionResponse = {
  success?: boolean;
  errors?: {
    index?: number;
    title?: string[];
    date?: string[];
    startTime?: string[];
    endTime?: string[];
    address?: string[];
    _form?: string[];
  }[];
};

export async function createEventAction(payload: EventsFormType): Promise<EventActionResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, errors: [{ _form: ["Unauthorized. Please login first."] }] };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
  });
  if (!invitation) {
    return { success: false, errors: [{ _form: ["Invitation not been created"] }] };
  }

  const parsed = eventsFormSchema.safeParse(payload);
  if (!parsed.success) {
    const flattenErrors = parsed.error.flatten().fieldErrors;

    if (flattenErrors.events) {
      return { errors: [{ _form: flattenErrors.events }] };
    }

    type EventError = {
      index: number;
      errors: Record<string, string[] | undefined>;
    };
    const errorMap = new Map<number, EventError>();

    Object.keys(flattenErrors).forEach((key) => {
      const match = key.match(/^events\.(\d+)\.(.+)$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];

        if (!errorMap.has(index)) {
          errorMap.set(index, { index, errors: {} });
        }

        const eventError = errorMap.get(index);
        if (eventError) {
          eventError.errors[field] = flattenErrors[key as keyof typeof flattenErrors];
        }
      }
    });

    return {
      success: false,
      errors: [...Array.from(errorMap.values())],
    };
  }

  try {
    const eventsData = parsed.data.events.map(({ id: _, ...event }) => ({
      ...event,
      invitationId: invitation.id,
    }));

    await prisma.event.createMany({
      data: eventsData,
    });

    return { success: true };
  } catch (error) {
    console.log("Create Event Error: ", error);

    return {
      success: false,
      errors: [{ _form: ["Something went wrong, please try again"] }],
    };
  }
}

export async function updateEventAction(data: EventsFormType): Promise<EventActionResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, errors: [{ _form: ["Unauthorized. Please login first."] }] };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    include: { events: true },
  });
  if (!invitation) {
    return { success: false, errors: [{ _form: ["Invitation not been created"] }] };
  }

  if (invitation.events.length === 0) {
    return { success: false, errors: [{ _form: ["Invitation event not been created"] }] };
  }

  console.log("raw data: ", data);

  const parsed = eventsFormSchema.safeParse(data);
  if (!parsed.success) {
    const flattenErrors = parsed.error.flatten().fieldErrors;

    if (flattenErrors.events) {
      return { errors: [{ _form: flattenErrors.events }] };
    }

    type EventError = {
      index: number;
      errors: Record<string, string[] | undefined>;
    };
    const errorMap = new Map<number, EventError>();

    Object.keys(flattenErrors).forEach((key) => {
      const match = key.match(/^events\.(\d+)\.(.+)$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];

        if (!errorMap.has(index)) {
          errorMap.set(index, { index, errors: {} });
        }

        const eventError = errorMap.get(index);
        if (eventError) {
          eventError.errors[field] = flattenErrors[key as keyof typeof flattenErrors];
        }
      }
    });

    return {
      success: false,
      errors: [...Array.from(errorMap.values())],
    };
  }

  try {
    const eventsData = parsed.data.events.map((event) => ({
      ...event,
      invitationId: invitation.id,
    }));

    await prisma.$transaction(
      eventsData.map(({ id, invitationId, ...event }) =>
        prisma.event.upsert({
          where: { id, invitationId },
          update: { ...event },
          create: {
            ...event,
            invitationId,
          },
        }),
      ),
    );

    return { success: true };
  } catch (error) {
    console.log("Update Invitation Event Error: ", error);

    return {
      success: false,
      errors: [{ _form: ["Something went wrong, please try again"] }],
    };
  }
}
