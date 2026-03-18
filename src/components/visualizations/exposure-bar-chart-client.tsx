"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { BenchmarkRunResult } from "@/lib/benchmark/types";

const bandColors = {
  Minimal: "#34d399",
  Limited: "#a3e635",
  Moderate: "#fbbf24",
  High: "#fb923c",
  "Very High": "#ef4444",
} as const;

export function ExposureBarChartClient({ run }: { run: BenchmarkRunResult }) {
  const data = [...run.roleResults]
    .sort((left, right) => right.exposureScore - left.exposureScore)
    .map((role) => ({
      name: role.roleName,
      exposure: role.exposureScore,
      band: role.exposureBand,
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 12, left: 12, bottom: 8 }}
      >
        <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          domain={[0, 100]}
          type="number"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          dataKey="name"
          tickFormatter={(value: string) =>
            value
              .replace("Customer Support Agent", "Customer Support")
              .replace("Executive Assistant", "Executive Asst.")
              .replace("Marketing Assistant", "Marketing Asst.")
              .replace("Research Analyst", "Research Analyst")
              .replace("Junior Software Developer", "Junior Developer")
              .replace("Project Coordinator", "Project Coord.")
          }
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickLine={false}
          type="category"
          width={126}
        />
        <Tooltip
          contentStyle={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            background: "rgba(8,15,29,0.96)",
            color: "#fff",
          }}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          formatter={(value) => [`Exposure: ${String(value ?? "")}`, "Score"]}
          itemStyle={{ color: "#f8fafc" }}
          labelStyle={{ color: "#f8fafc", fontWeight: 600 }}
        />
        <Bar dataKey="exposure" radius={[0, 10, 10, 0]}>
          {data.map((entry) => (
            <Cell fill={bandColors[entry.band]} key={entry.name} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
