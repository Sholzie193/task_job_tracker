import type { BenchmarkProvider } from "@/lib/benchmark/types";

export const openAiModelOptions = [
  {
    label: "GPT-5",
    value: "gpt-5",
    note: "Latest flagship baseline for broad frontier task evaluation",
  },
  {
    label: "GPT-5 Mini",
    value: "gpt-5-mini",
    note: "Lower-cost fast benchmark run with the current GPT-5 family",
  },
  {
    label: "GPT-5 Nano",
    value: "gpt-5-nano",
    note: "Smallest GPT-5 variant for lightweight directional comparisons",
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
    label: "Claude Sonnet 4",
    value: "claude-sonnet-4-20250514",
    note: "Latest verified Sonnet 4 API release for balanced role-task evaluation",
  },
  {
    label: "Claude Opus 4.1",
    value: "claude-opus-4-1-20250805",
    note: "Latest verified Opus API release for maximum reasoning depth",
  },
  {
    label: "Claude Opus 4",
    value: "claude-opus-4-20250514",
    note: "Prior Opus 4 generation for direct capability comparison",
  },
] as const;

export function getProviderModelOptions(provider: BenchmarkProvider) {
  return provider === "openai" ? openAiModelOptions : anthropicModelOptions;
}

export function getDefaultModelForProvider(provider: BenchmarkProvider) {
  return getProviderModelOptions(provider)[0].value;
}
