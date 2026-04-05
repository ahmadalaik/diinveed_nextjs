import { Main } from "@/components/layout/main";
import { authIsRequired } from "@/lib/auth/middleware";

export default async function DashboardPage() {
  const user = await authIsRequired();

  return (
    <Main className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold">Hello, {user.name}</h2>
        <p className="text-base">Manage your digital wedding invitation with easy here</p>
      </div>
    </Main>
  );
}
