"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { isValidEmail } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { FormField, formInputClass } from "@/components/ui/form-field";

interface AuthFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
}

type FieldErrors = Partial<
  Record<Exclude<keyof AuthFormValues, "rememberMe">, string>
>;

const initialValues: AuthFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  rememberMe: false,
};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange<K extends keyof AuthFormValues>(
    field: K,
    value: AuthFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    if (field !== "rememberMe") {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const nextErrors: FieldErrors = {};

    if (isSignup && !values.name.trim()) {
      nextErrors.name = "Enter your full name.";
    }
    if (!values.email.trim()) {
      nextErrors.email = "Enter your email.";
    } else if (!isValidEmail(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!values.password) {
      nextErrors.password = "Enter a password.";
    } else if (isSignup && values.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (isSignup && values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    console.log(isSignup ? "Sign up submitted" : "Login submitted", values);
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {isSignup && (
        <FormField id="auth-name" label="Full Name" error={errors.name}>
          <input
            id="auth-name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={formInputClass(!!errors.name)}
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </FormField>
      )}

      <FormField id="auth-email" label="Email" error={errors.email}>
        <input
          id="auth-email"
          type="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={formInputClass(!!errors.email)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </FormField>

      <FormField id="auth-password" label="Password" error={errors.password}>
        <div className="relative">
          <input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={formInputClass(!!errors.password, "pr-10")}
            placeholder="••••••••"
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </FormField>

      {isSignup && (
        <FormField
          id="auth-confirm-password"
          label="Confirm Password"
          error={errors.confirmPassword}
        >
          <input
            id="auth-confirm-password"
            type={showPassword ? "text" : "password"}
            value={values.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className={formInputClass(!!errors.confirmPassword)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </FormField>
      )}

      {!isSignup && (
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              checked={values.rememberMe}
              onChange={(e) => handleChange("rememberMe", e.target.checked)}
              className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            Remember me
          </label>
          <Link
            href="#"
            className="font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      )}

      <Button type="submit" size="lg" className="mt-2">
        {isSignup ? "Sign Up" : "Login"}
      </Button>

      {submitted && (
        <p
          className="text-center text-sm font-medium text-primary"
          role="status"
        >
          {isSignup
            ? "Account created (demo only)."
            : "Logged in (demo only)."}
        </p>
      )}
    </form>
  );
}
