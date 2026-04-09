import { Main } from "@/components/layout/main";
import { authIsRequired } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";
import EventEditForm from "@/components/pages/invitation/event/event-edit-form";
import EventCreateForm from "@/components/pages/invitation/event/event-create-form";

export default async function InvitationEventPage() {
  const user = await authIsRequired();
  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    include: {
      events: {
        orderBy: { order: "asc" },
      },
    },
  });

  const events = invitation?.events.map((event) => ({
    ...event,
    date: event.date.toISOString(),
    startTime: event.startTime.toISOString(),
    endTime: event.endTime.toISOString(),
  }));

  console.log("events: ", events);

  return (
    <Main className="max-w-2xl mx-auto">
      {events && events.length > 0 ? <EventEditForm events={events} /> : <EventCreateForm />}
    </Main>
  );
}
