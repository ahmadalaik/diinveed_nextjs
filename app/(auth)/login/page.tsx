import LoginForm from "@/components/pages/auth/login-form";
import { authIsNotRequired } from "@/lib/auth/middleware";

export default async function LoginPage() {
  await authIsNotRequired();

  return <LoginForm />;
}
