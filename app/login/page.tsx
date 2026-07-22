import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/components/forms/AuthForm";

export const metadata: Metadata = {
  title: "Login | Lux Estate",
  description: "Log in to your Lux Estate account.",
};

export default function LoginPage() {
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
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Log in to manage your listings and inquiries.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border sm:p-8">
          <AuthForm mode="login" />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
