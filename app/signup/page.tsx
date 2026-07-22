import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/components/forms/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up | Lux Estate",
  description: "Create a Lux Estate account to list and manage properties.",
};

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Lux Estate
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            List properties and manage inquiries in one place.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border sm:p-8">
          <AuthForm mode="signup" />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
