"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/layout/Container";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const team: {
  name: string;
  role: string;
  avatar: string;
  objectPositionClass: string;
}[] = [
  {
    name: "Maya Torres",
    role: "Founder & CEO",
    avatar: "https://picsum.photos/seed/maya-torres/400/400",
    objectPositionClass: "object-center",
  },
  {
    name: "Elliot Park",
    role: "Head of Product",
    avatar: "https://picsum.photos/seed/elliot-park/400/300",
    objectPositionClass: "object-[50%_30%]",
  },
  {
    name: "Priya Nandakumar",
    role: "Lead Engineer",
    avatar: "https://picsum.photos/seed/priya-nandakumar/400/400",
    objectPositionClass: "object-center",
  },
  {
    name: "Jordan Blake",
    role: "Customer Success Lead",
    avatar: "https://picsum.photos/seed/jordan-blake/400/300",
    objectPositionClass: "object-[50%_25%]",
  },
];

export function TeamGrid() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
            Our Team
          </p>
          <h2 className="mt-2 text-[clamp(1.6rem,3.2vw,2.5rem)] font-bold tracking-tight text-neutral-900">
            The people building Lux Estate
          </h2>
        </div>

        <motion.div
          {...(reduce
            ? {}
            : {
                initial: "hidden",
                whileInView: "visible",
                viewport: viewportOnce,
                variants: stagger(0.08),
              })}
          className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8"
        >
          {team.map((member) => (
            <motion.article
              key={member.name}
              variants={reduce ? undefined : fadeUp}
              className="group text-center"
            >
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full shadow-[0_8px_24px_-8px_rgba(16,24,40,0.18)] ring-4 ring-white transition-transform duration-[400ms] group-hover:scale-[1.04] sm:h-32 sm:w-32">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  fill
                  sizes="(min-width: 640px) 128px, 112px"
                  className={`object-cover ${member.objectPositionClass}`}
                />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-neutral-900">
                {member.name}
              </h3>
              <p className="mt-0.5 text-[13px] text-neutral-500">
                {member.role}
              </p>
              <span className="mx-auto mt-2 block h-[2px] w-0 bg-amber-700 transition-all duration-300 group-hover:w-8" />
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
