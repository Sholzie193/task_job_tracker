import type { BenchmarkProvider } from "@/lib/benchmark/types";

export const openAiModelOptions = [
  {
    label: "GPT-5.4",
    value: "gpt-5.4",
    note: "Flagship OpenAI preset for the primary frontier benchmark run",
  },
  {
    label: "GPT-5.4 Mini",
    value: "gpt-5.4-mini",
    note: "Faster lower-cost GPT-5.4 variant for directional comparisons",
  },
  {
    label: "GPT-5.4 Nano",
    value: "gpt-5.4-nano",
    note: "Smallest GPT-5.4 preset for lightweight benchmark runs",
  },
  {
    label: "GPT-4.1",
    value: "gpt-4.1",
    note: "Strong general production baseline",
  },
  {
    label: "o4-mini",
    value: "o4-mini",
    note: "Reasoning-focused lightweight comparator",
  },
] as const;

export const anthropicModelOptions = [
  {
    label: "Claude Sonnet 4.5",
    value: "claude-sonnet-4.5",
    note: "Primary Anthropic balanced preset for broad role-task evaluation",
  },
  {
    label: "Claude Sonnet 4.6",
    value: "claude-sonnet-4.6",
    note: "Updated Sonnet preset for newer balanced frontier benchmark runs",
  },
  {
    label: "Claude Opus 4.6",
    value: "claude-opus-4.6",
    note: "Highest-end Anthropic preset for deeper reasoning-heavy benchmarks",
  },
  {
    label: "Claude Opus 4.1",
    value: "claude-opus-4.1",
    note: "Prior Opus baseline kept as a secondary comparator",
  },
] as const;

export function getProviderModelOptions(provider: BenchmarkProvider) {
  return provider === "openai" ? openAiModelOptions : anthropicModelOptions;
}

export function getDefaultModelForProvider(provider: BenchmarkProvider) {
  return getProviderModelOptions(provider)[0].value;
}
