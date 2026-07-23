import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contact | Lux Estate",
  description: "Get in touch with the Lux Estate team.",
};

export default function ContactPage() {
  return (
    <Container className="pb-16 sm:pb-20 lg:pb-24">
      <div className="flex flex-col gap-2 border-b border-neutral-200 pb-8 pt-10 sm:pt-12">
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-tight text-neutral-900">
          Get in Touch
        </h1>
        <p className="max-w-2xl text-[15px] text-neutral-500">
          Have a question about a listing, your account, or something else?
          Send us a message and we&apos;ll get back to you within one
          business day.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
        <div className="order-1">
          <ContactForm />
        </div>

        <div className="order-2">
          <ContactInfo />
        </div>
      </div>
    </Container>
  );
}
