import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";

export async function authIsRequired() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function authIsNotRequired() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }
}
