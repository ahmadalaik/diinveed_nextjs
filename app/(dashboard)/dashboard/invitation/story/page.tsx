import { Main } from "@/components/layout/main";
import { authIsRequired } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";
import StoryEditForm from "@/components/pages/invitation/story/story-edit-form";
import StoryCreateForm from "@/components/pages/invitation/story/story-create-form";

export default async function InvitationStoryPage() {
  const user = await authIsRequired();
  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    include: {
      stories: {
        orderBy: { order: "asc" },
      },
    },
  });

  const stories = invitation?.stories.map((story) => ({
    ...story,
    date: story.date.toISOString(),
  }));

  return (
    <Main className="max-w-2xl mx-auto py-12">
      {stories && stories.length > 0 ? <StoryEditForm stories={stories} /> : <StoryCreateForm />}
    </Main>
  );
}
