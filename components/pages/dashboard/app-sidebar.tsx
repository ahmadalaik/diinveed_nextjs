import { Logo } from "./logo";
import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../../ui/sidebar";
import { NavUser } from "./nav-user";
import { UserRole } from "@/generated/prisma/enums";

interface userProps {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: userProps }) {
  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
