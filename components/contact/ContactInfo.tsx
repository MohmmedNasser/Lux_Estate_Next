"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { EASE, fadeUp } from "@/lib/motion";
import { LocationMap } from "@/components/property/LocationMap";

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

export function ContactInfo() {
    const reduce = useReducedMotion();

    return (
        <motion.div
            {...(reduce
                ? {}
                : {
                      initial: "hidden",
                      animate: "visible",
                      variants: fadeUp,
                      transition: { duration: 0.6, delay: 0.1, ease: EASE },
                  })}
            className="flex flex-col gap-8"
        >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {contactDetails.map((detail) => (
                    <div key={detail.label} className="flex items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-neutral-900 text-amber-400">
                            <detail.icon
                                className="size-4.5"
                                aria-hidden="true"
                            />
                        </span>
                        <div>
                            <p className="text-[11px] uppercase tracking-wide text-neutral-500">
                                {detail.label}
                            </p>
                            <p className="mt-0.5 text-[12px] font-medium text-neutral-900">
                                {detail.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <LocationMap
                address="123 Congress Ave, Austin, TX 78701"
                location="Austin, TX"
            />
        </motion.div>
    );
}
