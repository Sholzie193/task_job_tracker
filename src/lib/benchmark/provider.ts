import type { BenchmarkProvider } from "@/lib/benchmark/types";

export function getProviderLabel(provider: BenchmarkProvider) {
  return provider === "openai" ? "OpenAI" : "Anthropic";
}

export function getApiKeyPlaceholder(provider: BenchmarkProvider) {
  return provider === "openai" ? "sk-..." : "sk-ant-...";
}

