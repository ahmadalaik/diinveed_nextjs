import { Main } from "@/components/layout/main";
import { prisma } from "@/lib/prisma";
import { authIsRequired } from "@/lib/auth/middleware";
import CoupleEditForm from "@/components/pages/invitation/couple/couple-edit-form";
import CoupleCreateForm from "@/components/pages/invitation/couple/couple-create-form";

export default async function InvitationCouplePage() {
  const user = await authIsRequired();
  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
  });

  return (
    <Main className="max-w-2xl mx-auto">
      {invitation ? <CoupleEditForm invitation={invitation} /> : <CoupleCreateForm />}
    </Main>
  );
}
