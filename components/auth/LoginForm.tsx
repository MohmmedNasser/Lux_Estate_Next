"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Loader2, Mail } from "lucide-react";

import { isValidEmail } from "@/lib/validation";
import {
  FormField,
  PasswordInput,
  formInputClass,
} from "@/components/ui/form-field";

interface Values {
  email: string;
  password: string;
  rememberMe: boolean;
}

type Errors = Partial<Record<"email" | "password", string>>;

const initialValues: Values = { email: "", password: "", rememberMe: false };

export function LoginForm() {
  const reduce = useReducedMotion();
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [authError, setAuthError] = useState<string | null>(null);

  function set<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!values.email.trim()) next.email = "Enter your email.";
    else if (!isValidEmail(values.email))
      next.email = "Enter a valid email address.";
    if (!values.password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    if (!validate()) return;

    setStatus("submitting");
    window.setTimeout(() => {
      console.log("Login submitted", values);
      setStatus("success");
    }, 700);
  }

  return (
    <>
      <h1 className="text-center text-[22px] font-semibold text-neutral-900">
        Welcome back
      </h1>
      <p className="mt-1.5 text-center text-[14px] text-neutral-500">
        Log in to manage your listings and inquiries.
      </p>

      <AnimatePresence initial={false}>
        {authError && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-5 overflow-hidden"
          >
            <p className="rounded-lg bg-rose-50 px-4 py-3 text-[13px] text-rose-700 ring-1 ring-rose-200">
              {authError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 flex flex-col gap-4"
      >
        <FormField
          id="login-email"
          label="Email"
          error={errors.email}
          icon={<Mail className="size-4" aria-hidden="true" />}
        >
          <input
            id="login-email"
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            className={formInputClass(!!errors.email, "h-11 pl-10")}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FormField>

        <FormField id="login-password" label="Password" error={errors.password}>
          <PasswordInput
            id="login-password"
            value={values.password}
            onChange={(value) => set("password", value)}
            hasError={!!errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </FormField>

        <div className="mt-1 flex items-center justify-between">
          <label className="flex items-center gap-2 text-[13px] text-neutral-600">
            <span className="relative grid h-4 w-4 shrink-0 place-items-center">
              <input
                type="checkbox"
                checked={values.rememberMe}
                onChange={(e) => set("rememberMe", e.target.checked)}
                className="peer h-4 w-4 shrink-0 appearance-none rounded border border-neutral-300 checked:border-amber-700 checked:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
              />
              <Check
                className="pointer-events-none absolute size-3 text-white opacity-0 peer-checked:opacity-100"
                aria-hidden="true"
              />
            </span>
            Remember me
          </label>
          <Link
            href="#"
            className="text-[13px] font-medium text-amber-700 hover:text-amber-800"
          >
            Forgot password?
          </Link>
        </div>

        <motion.button
          type="submit"
          disabled={status === "submitting"}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-amber-700 font-semibold text-white transition-colors hover:bg-amber-800 disabled:opacity-70"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Logging in…
            </>
          ) : (
            "Login"
          )}
        </motion.button>

        {status === "success" && (
          <p
            role="status"
            className="text-center text-[13px] font-medium text-amber-700"
          >
            Logged in (demo only).
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-[14px] text-neutral-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-amber-700 hover:text-amber-800"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
