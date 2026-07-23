"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, Mail, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { signUp } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/validations/authSchemas";
import {
  FormField,
  PasswordInput,
  formInputClass,
} from "@/components/ui/form-field";

interface Values {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const initialValues: Values = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function passwordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (
    /[^a-zA-Z0-9]/.test(password) ||
    (/[a-z]/.test(password) && /[A-Z]/.test(password))
  )
    score++;
  return score;
}

const strengthColors = ["bg-rose-500", "bg-amber-500", "bg-emerald-500"];

export function SignupForm() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [authError, setAuthError] = useState<string | null>(null);

  const strength = passwordStrength(values.password);

  function set<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): boolean {
    const result = signUpSchema.safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: Errors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof Errors;
      if (key && !next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setAuthError(null);
    if (!validate()) return;

    setStatus("submitting");
    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      setAuthError(error.message ?? "Couldn't create your account. Please try again.");
      setStatus("idle");
      return;
    }

    setStatus("success");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <h1 className="text-center text-[22px] font-semibold text-neutral-900">
        Create your account
      </h1>
      <p className="mt-1.5 text-center text-[14px] text-neutral-500">
        List properties and manage inquiries in one place.
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
          id="signup-name"
          label="Full Name"
          error={errors.name}
          icon={<User className="size-4" aria-hidden="true" />}
        >
          <input
            id="signup-name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className={formInputClass(!!errors.name, "h-11 pl-10")}
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </FormField>

        <FormField
          id="signup-email"
          label="Email"
          error={errors.email}
          icon={<Mail className="size-4" aria-hidden="true" />}
        >
          <input
            id="signup-email"
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            className={formInputClass(!!errors.email, "h-11 pl-10")}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FormField>

        <FormField id="signup-password" label="Password" error={errors.password}>
          <PasswordInput
            id="signup-password"
            value={values.password}
            onChange={(value) => set("password", value)}
            hasError={!!errors.password}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </FormField>

        <div className="-mt-2 flex flex-col gap-1.5">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full bg-neutral-200 transition-colors duration-300",
                  strength > i && strengthColors[i],
                )}
              />
            ))}
          </div>
          <p className="text-[12px] text-neutral-500">
            Use 8+ characters with a number
          </p>
        </div>

        <FormField
          id="signup-confirm-password"
          label="Confirm Password"
          error={errors.confirmPassword}
        >
          <PasswordInput
            id="signup-confirm-password"
            value={values.confirmPassword}
            onChange={(value) => set("confirmPassword", value)}
            hasError={!!errors.confirmPassword}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </FormField>

        <motion.button
          type="submit"
          disabled={status === "submitting"}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-amber-700 font-semibold text-white transition-colors hover:bg-amber-800 disabled:opacity-70"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Creating account…
            </>
          ) : (
            "Sign Up"
          )}
        </motion.button>

        {status === "success" && (
          <p
            role="status"
            className="text-center text-[13px] font-medium text-amber-700"
          >
            Account created — redirecting…
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-[14px] text-neutral-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-amber-700 hover:text-amber-800"
        >
          Login
        </Link>
      </p>
    </>
  );
}
