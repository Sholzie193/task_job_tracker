"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import type { RoleExposureResult } from "@/lib/benchmark/types";
import { cn } from "@/lib/utils";

const bandStyles = {
  Minimal:
    "border-emerald-300/35 bg-linear-to-br from-emerald-300/22 via-emerald-400/12 to-[var(--surface-2)]",
  Limited:
    "border-lime-300/34 bg-linear-to-br from-lime-300/22 via-lime-400/10 to-[var(--surface-2)]",
  Moderate:
    "border-amber-300/34 bg-linear-to-br from-amber-300/24 via-amber-400/10 to-[var(--surface-2)]",
  High:
    "border-orange-400/36 bg-linear-to-br from-orange-300/26 via-orange-500/12 to-[var(--surface-2)]",
  "Very High":
    "border-red-400/42 bg-linear-to-br from-red-300/28 via-red-500/14 to-[var(--surface-2)]",
} as const;

const bandAccentStyles = {
  Minimal: "bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300",
  Limited: "bg-linear-to-r from-lime-300 via-lime-400 to-yellow-300",
  Moderate: "bg-linear-to-r from-yellow-300 via-amber-400 to-orange-400",
  High: "bg-linear-to-r from-amber-300 via-orange-400 to-orange-500",
  "Very High": "bg-linear-to-r from-orange-400 via-red-400 to-red-500",
} as const;

const bandBadgeStyles = {
  Minimal: "border-emerald-300/30 bg-emerald-300/14 text-emerald-100",
  Limited: "border-lime-300/30 bg-lime-300/14 text-lime-100",
  Moderate: "border-amber-300/30 bg-amber-300/14 text-amber-100",
  High: "border-orange-400/30 bg-orange-400/14 text-orange-100",
  "Very High": "border-red-400/30 bg-red-400/14 text-red-100",
} as const;

const spanMap = {
  Minimal: "lg:col-span-3 lg:row-span-1",
  Limited: "lg:col-span-4 lg:row-span-1",
  Moderate: "lg:col-span-4 lg:row-span-1",
  High: "lg:col-span-6 lg:row-span-1",
  "Very High": "lg:col-span-6 lg:row-span-2",
} as const;

export function ExposureMatrix({
  roles,
  selectedRoleId,
  onSelectRole,
  getHref,
}: {
  roles: RoleExposureResult[];
  selectedRoleId?: string | null;
  onSelectRole?: (roleId: string) => void;
  getHref?: (roleId: string) => string;
}) {
  return (
    <section className="space-y-5">
      <SectionHeading
        eyebrow="Role Exposure Visualization"
        title="Exposure matrix"
        description="Click a role to inspect its rationale, strongest task clusters, weakest tasks, and human dependency profile."
      />
      <Panel>
        <div className="grid gap-4 lg:grid-cols-12 lg:auto-rows-[140px]">
          {roles.map((role, index) => (
            <ExposureTile
              getHref={getHref}
              index={index}
              key={role.roleId}
              onSelectRole={onSelectRole}
              role={role}
              selectedRoleId={selectedRoleId ?? null}
            />
          ))}
        </div>
      </Panel>
    </section>
  );
}

function ExposureTile({
  role,
  index,
  selectedRoleId,
  onSelectRole,
  getHref,
}: {
  role: RoleExposureResult;
  index: number;
  selectedRoleId: string | null;
  onSelectRole?: (roleId: string) => void;
  getHref?: (roleId: string) => string;
}) {
  const outerClassName = cn(
    "block min-h-[180px] lg:min-h-0",
    spanMap[role.exposureBand],
  );

  const tileClassName = cn(
    "group relative h-full overflow-hidden rounded-[28px] border p-5 text-left transition",
    bandStyles[role.exposureBand],
    selectedRoleId === role.roleId &&
      "ring-2 ring-[color:var(--accent)] ring-offset-2 ring-offset-[var(--background)]",
  );

  const content = (
    <motion.div
      className={tileClassName}
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.28, delay: index * 0.03 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent" />
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
      </div>
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-3)]">
              {role.roleCategory}
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[color:var(--text-1)]">
              {role.roleName}
            </h3>
          </div>
          <ArrowUpRight className="h-4 w-4 text-[color:var(--text-3)] transition group-hover:text-[color:var(--text-1)]" />
        </div>
        <div className="space-y-3">
          <div className="flex items-end justify-between gap-4">
            <p className="text-4xl font-semibold tracking-[-0.06em] text-[color:var(--text-1)]">
              {role.exposureScore}
            </p>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]",
                bandBadgeStyles[role.exposureBand],
              )}
            >
              {role.exposureBand}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[color:color-mix(in_srgb,var(--text-1)_10%,transparent)]">
            <div
              className={cn("h-full rounded-full", bandAccentStyles[role.exposureBand])}
              style={{ width: `${role.exposureScore}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (getHref) {
    return (
      <Link className={outerClassName} href={getHref(role.roleId)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={outerClassName}
      onClick={() => onSelectRole?.(role.roleId)}
      type="button"
    >
      {content}
    </button>
  );
}
