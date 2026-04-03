import z from "zod";

export const eventSchema = z.object({
  id: z.string(),
  title: z.string().nonempty("Event name is required"),
  date: z.iso.datetime({ error: "Date is required" }),
  startTime: z.string().nonempty("Event start time is required"),
  endTime: z.string().nonempty("Event end time is required"),
  address: z.string().nonempty("Event address is required"),
  order: z.int(),
});

export const eventsFormSchema = z.object({
  events: z.array(eventSchema).min(1, "At least one event is required"),
});

export type EventType = z.infer<typeof eventSchema>;
export type EventsFormType = z.infer<typeof eventsFormSchema>;
