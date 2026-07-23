import type { Metadata } from "next";

import { AuthShell } from "@/components/ui/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | Lux Estate",
  description: "Create a Lux Estate account to list and manage properties.",
};

export default function SignupPage() {
  return (
    <AuthShell>
      <SignupForm />
    </AuthShell>
  );
}
