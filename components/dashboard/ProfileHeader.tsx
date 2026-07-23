"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PencilLine } from "lucide-react";

import { fadeUp } from "@/lib/motion";
import { formatDate } from "@/lib/format";
import type { User } from "@/types";

export function ProfileHeader({ user }: { user: User }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      {...(reduce
        ? {}
        : { initial: "hidden", animate: "visible", variants: fadeUp })}
      className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-1 ring-neutral-200 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-neutral-100 shadow-sm ring-4 ring-white">
          <Image
            src={user.avatar ?? ""}
            alt={user.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-[18px] font-semibold text-neutral-900">
            {user.name}
          </h1>
          <p className="text-[14px] text-neutral-500">{user.email}</p>
          <p className="mt-0.5 text-[13px] text-neutral-400">
            Member since {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => console.log("Edit profile clicked (demo only)")}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-[14px] font-medium text-neutral-700 ring-1 ring-neutral-300 transition-colors hover:bg-neutral-50 sm:w-auto sm:self-start"
      >
        <PencilLine className="size-4" aria-hidden="true" />
        Edit Profile
      </button>
    </motion.div>
  );
}
