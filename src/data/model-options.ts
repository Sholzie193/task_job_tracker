import type { BenchmarkProvider } from "@/lib/benchmark/types";

export const openAiModelOptions = [
  {
    label: "GPT-5.4",
    value: "gpt-5.4",
    note: "Frontier flagship reasoning baseline",
  },
  {
    label: "GPT-5.4 Mini",
    value: "gpt-5.4-mini",
    note: "Faster and cheaper directional run",
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
    value: "claude-sonnet-4-5",
    note: "Balanced frontier default for broad task work",
  },
  {
    label: "Claude Opus 4.1",
    value: "claude-opus-4-1",
    note: "Higher-end reasoning and writing baseline",
  },
  {
    label: "Claude Haiku 4.5",
    value: "claude-haiku-4-5",
    note: "Faster lower-cost directional benchmark run",
  },
] as const;

export function getProviderModelOptions(provider: BenchmarkProvider) {
  return provider === "openai" ? openAiModelOptions : anthropicModelOptions;
}

export function getDefaultModelForProvider(provider: BenchmarkProvider) {
  return getProviderModelOptions(provider)[0].value;
}
