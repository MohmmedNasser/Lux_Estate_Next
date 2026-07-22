"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { isValidEmail } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { FormField, formInputClass } from "@/components/ui/form-field";

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof ContactFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): boolean {
    const nextErrors: FieldErrors = {};
    if (!values.name.trim()) nextErrors.name = "Enter your name.";
    if (!values.email.trim()) {
      nextErrors.email = "Enter your email.";
    } else if (!isValidEmail(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!values.subject.trim()) nextErrors.subject = "Add a subject.";
    if (!values.message.trim()) nextErrors.message = "Add a message.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    console.log("Contact message submitted", {
      ...values,
      createdAt: new Date().toISOString(),
    });

    setSubmitted(true);
    setValues(initialValues);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-secondary/60 p-8 text-center">
        <p className="text-lg font-semibold text-foreground">Message sent</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you within one
          business day.
        </p>
        <Button
          type="button"
          variant="ghost"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField id="contact-name" label="Name" error={errors.name}>
        <input
          id="contact-name"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={formInputClass(!!errors.name)}
          placeholder="Your name"
        />
      </FormField>

      <FormField id="contact-email" label="Email" error={errors.email}>
        <input
          id="contact-email"
          type="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={formInputClass(!!errors.email)}
          placeholder="you@example.com"
        />
      </FormField>

      <FormField id="contact-subject" label="Subject" error={errors.subject}>
        <input
          id="contact-subject"
          value={values.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          className={formInputClass(!!errors.subject)}
          placeholder="How can we help?"
        />
      </FormField>

      <FormField id="contact-message" label="Message" error={errors.message}>
        <textarea
          id="contact-message"
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          rows={5}
          className={formInputClass(!!errors.message)}
          placeholder="Tell us more..."
        />
      </FormField>

      <Button type="submit" size="lg" className="gap-2">
        <Send className="size-4" />
        Send Message
      </Button>
    </form>
  );
}
