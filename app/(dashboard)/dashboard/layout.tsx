import { AppSidebar } from "@/components/pages/dashboard/app-sidebar";
import { Header } from "@/components/pages/dashboard/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { authIsRequired } from "@/lib/auth/middleware";

export default async function DashboardLayout({ children }: { children?: ReactNode }) {
  const user = await authIsRequired();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="@container/content">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
