import { cn } from "@/lib/utils";

export function Main({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      className={cn("flex flex-col flex-1 w-full px-4 py-4 gap-4", className)}
      {...props}
    />
  );
}
