import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Lux Estate",
  description: "Get in touch with the Lux Estate team.",
};

const contactDetails = [
  {
    icon: MapPin,
    label: "Address",
    value: "123 Congress Ave, Austin, TX 78701",
  },
  { icon: Phone, label: "Phone", value: "+1 (512) 555-0100" },
  { icon: Mail, label: "Email", value: "hello@luxestate.com" },
  { icon: Clock, label: "Working Hours", value: "Mon – Fri, 9am – 6pm" },
];

export default function ContactPage() {
  return (
    <Container className="py-10 sm:py-14">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Get in Touch
        </h1>
        <p className="mt-3 text-muted-foreground">
          Have a question about a listing, your account, or something else?
          Send us a message and we&apos;ll get back to you within one
          business day.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border sm:p-8">
          <ContactForm />
        </div>

        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {contactDetails.map((detail) => (
              <div key={detail.label} className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <detail.icon className="size-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {detail.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {detail.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/30 py-16 text-center">
            <MapPin className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              123 Congress Ave, Austin, TX
            </p>
            <p className="text-xs text-muted-foreground">
              Interactive map coming soon
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
