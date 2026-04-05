"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export function Header() {
  const [offset, setOffset] = useState(false);

  const handleScroll = () => {
    setOffset(window.scrollY > 10);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((path) => path);
  const nonClickableSegments = [""];

  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header
      className={cn(
        "sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-all ease-linear duration-300 z-10",
        offset ? "bg-background/20 backdrop-blur-lg border-b" : "bg-background rounded-t-xl",
      )}
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {pathSegments.map((value: string, index: number) => {
              const routeTo: string = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const isLast = index === pathSegments.length - 1;
              const isNonClickable = nonClickableSegments.includes(value.toLocaleLowerCase());
              const readableValue = formatSegment(value);

              return (
                <React.Fragment key={routeTo}>
                  <BreadcrumbItem>
                    {isLast || isNonClickable ? (
                      <BreadcrumbPage>{readableValue}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={routeTo} className="hidden md:block">
                        {readableValue}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>

                  {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
