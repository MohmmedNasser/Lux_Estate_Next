"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { isValidEmail } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { FormField, formInputClass } from "@/components/ui/form-field";

interface InquiryFormValues {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof InquiryFormValues, string>>;

const initialValues: InquiryFormValues = {
  senderName: "",
  senderEmail: "",
  senderPhone: "",
  message: "",
};

export function InquiryForm({ propertyId }: { propertyId: string }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof InquiryFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): boolean {
    const nextErrors: FieldErrors = {};
    if (!values.senderName.trim()) nextErrors.senderName = "Enter your name.";
    if (!values.senderEmail.trim()) {
      nextErrors.senderEmail = "Enter your email.";
    } else if (!isValidEmail(values.senderEmail)) {
      nextErrors.senderEmail = "Enter a valid email address.";
    }
    if (!values.message.trim()) nextErrors.message = "Add a short message.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    console.log("Inquiry submitted", {
      propertyId,
      ...values,
      createdAt: new Date().toISOString(),
    });

    setSubmitted(true);
    setValues(initialValues);
  }

  if (submitted) {
    return (
      <div
        id="inquiry-form"
        className="rounded-xl bg-secondary/60 p-5 text-center"
      >
        <p className="font-semibold text-foreground">Message sent</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The owner will get back to you shortly.
        </p>
        <Button
          type="button"
          variant="ghost"
          className="mt-3"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      id="inquiry-form"
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-3"
    >
      <FormField id="inquiry-name" label="Name" error={errors.senderName}>
        <input
          id="inquiry-name"
          value={values.senderName}
          onChange={(e) => handleChange("senderName", e.target.value)}
          className={formInputClass(!!errors.senderName)}
          placeholder="Your name"
        />
      </FormField>

      <FormField id="inquiry-email" label="Email" error={errors.senderEmail}>
        <input
          id="inquiry-email"
          type="email"
          value={values.senderEmail}
          onChange={(e) => handleChange("senderEmail", e.target.value)}
          className={formInputClass(!!errors.senderEmail)}
          placeholder="you@example.com"
        />
      </FormField>

      <FormField id="inquiry-phone" label="Phone (optional)">
        <input
          id="inquiry-phone"
          type="tel"
          value={values.senderPhone}
          onChange={(e) => handleChange("senderPhone", e.target.value)}
          className={formInputClass(false)}
          placeholder="+1 555 555 0100"
        />
      </FormField>

      <FormField id="inquiry-message" label="Message" error={errors.message}>
        <textarea
          id="inquiry-message"
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          rows={4}
          className={formInputClass(!!errors.message)}
          placeholder="I'd like to schedule a viewing..."
        />
      </FormField>

      <Button type="submit" className="gap-2">
        <Send className="size-4" />
        Send Message
      </Button>
    </form>
  );
}
