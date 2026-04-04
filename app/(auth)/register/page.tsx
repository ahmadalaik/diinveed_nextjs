import RegisterForm from "@/components/pages/auth/register-form";
import { authIsNotRequired } from "@/lib/auth/middleware";

export default async function RegisterPage() {
  await authIsNotRequired();

  return <RegisterForm />;
}
