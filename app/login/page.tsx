import type { Metadata } from "next";

import { AuthShell } from "@/components/ui/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | Lux Estate",
  description: "Log in to your Lux Estate account.",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
