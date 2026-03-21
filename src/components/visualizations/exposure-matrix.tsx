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
    "border-emerald-400/36 bg-linear-to-br from-emerald-300/26 via-emerald-400/14 to-[var(--surface-2)]",
  Limited:
    "border-lime-400/34 bg-linear-to-br from-lime-300/24 via-lime-400/12 to-[var(--surface-2)]",
  Moderate:
    "border-amber-400/34 bg-linear-to-br from-amber-300/26 via-amber-400/14 to-[var(--surface-2)]",
  High:
    "border-orange-400/38 bg-linear-to-br from-orange-300/28 via-orange-500/16 to-[var(--surface-2)]",
  "Very High":
    "border-red-400/46 bg-linear-to-br from-red-300/30 via-red-500/18 to-[var(--surface-2)]",
} as const;

const bandAccentStyles = {
  Minimal: "bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300",
  Limited: "bg-linear-to-r from-lime-300 via-lime-400 to-yellow-300",
  Moderate: "bg-linear-to-r from-yellow-300 via-amber-400 to-orange-400",
  High: "bg-linear-to-r from-amber-300 via-orange-400 to-orange-500",
  "Very High": "bg-linear-to-r from-orange-400 via-red-400 to-red-500",
} as const;

const bandBadgeStyles = {
  Minimal:
    "border-[color:color-mix(in_srgb,#10b981_30%,transparent)] bg-[color:color-mix(in_srgb,#10b981_14%,var(--surface-soft))] text-[color:color-mix(in_srgb,var(--text-1)_74%,#10b981)]",
  Limited:
    "border-[color:color-mix(in_srgb,#84cc16_30%,transparent)] bg-[color:color-mix(in_srgb,#84cc16_14%,var(--surface-soft))] text-[color:color-mix(in_srgb,var(--text-1)_74%,#65a30d)]",
  Moderate:
    "border-[color:color-mix(in_srgb,#f59e0b_30%,transparent)] bg-[color:color-mix(in_srgb,#f59e0b_14%,var(--surface-soft))] text-[color:color-mix(in_srgb,var(--text-1)_74%,#b45309)]",
  High:
    "border-[color:color-mix(in_srgb,#f97316_30%,transparent)] bg-[color:color-mix(in_srgb,#f97316_14%,var(--surface-soft))] text-[color:color-mix(in_srgb,var(--text-1)_74%,#c2410c)]",
  "Very High":
    "border-[color:color-mix(in_srgb,#ef4444_32%,transparent)] bg-[color:color-mix(in_srgb,#ef4444_14%,var(--surface-soft))] text-[color:color-mix(in_srgb,var(--text-1)_74%,#b91c1c)]",
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
        eyebrow="Role map"
        title="Exposure matrix"
        description="Select a role."
      />
      <Panel className="p-4">
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
    "hover-halo group relative h-full overflow-hidden rounded-[4px] border p-4 text-left transition",
    bandStyles[role.exposureBand],
    selectedRoleId === role.roleId &&
      "ring-2 ring-[color:var(--accent)] ring-offset-2 ring-offset-[var(--background)]",
  );

  const content = (
    <motion.div
      className={tileClassName}
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.28, delay: index * 0.03 }}
      whileHover={{ y: -2, x: 2 }}
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
            <h3 className="mt-2 text-lg font-medium tracking-[-0.03em] text-[color:var(--text-1)]">
              {role.roleName}
            </h3>
          </div>
          <ArrowUpRight className="h-4 w-4 text-[color:var(--text-3)] transition group-hover:text-[color:var(--text-1)]" />
        </div>
        <div className="space-y-3">
          <div className="flex items-end justify-between gap-4">
            <p className="text-4xl font-medium tracking-[-0.06em] text-[color:var(--text-1)]">
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
