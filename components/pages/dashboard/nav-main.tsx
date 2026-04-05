"use client";

import { ChevronRight, LayoutDashboard, Mail, Settings2 } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../../ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import Link from "next/link";

const navsMain = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  {
    title: "Invitations",
    url: "#",
    icon: Mail,
    items: [
      { title: "Overview", url: "/dashboard/invitations" },
      { title: "Couple", url: "/dashboard/invitation/couple" },
      { title: "Event", url: "/dashboard/invitation/event" },
      { title: "Story", url: "/dashboard/invitation/story" },
      { title: "Gallery", url: "/dashboard/invitation/gallery" },
      { title: "Gift", url: "/dashboard/invitation/gift" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      { title: "General", url: "#" },
      { title: "Team", url: "#" },
      { title: "Billing", url: "#" },
      { title: "Limits", url: "#" },
    ],
  },
];

export function NavMain() {
  const pathname = usePathname();

  const checkActive = (url: string) => {
    if (!pathname) return false;

    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        {navsMain.map((nav) => {
          const hasSubItems = nav.items && nav.items.length > 0;

          const isParentActive = hasSubItems
            ? nav.items?.some((sub) => pathname === sub.url)
            : checkActive(nav.url);

          return hasSubItems ? (
            <Collapsible
              key={nav.title}
              asChild
              defaultOpen={isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={nav.title} isActive={isParentActive}>
                    {nav.icon && <nav.icon />}
                    <span>{nav.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {nav.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={nav.title}>
              <SidebarMenuButton asChild tooltip={nav.title} isActive={checkActive(nav.url)}>
                <Link href={nav.url}>
                  {nav.icon && <nav.icon />}
                  <span>{nav.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
