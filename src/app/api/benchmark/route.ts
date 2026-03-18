import { NextResponse } from "next/server";

import { generateMockBenchmarkRun } from "@/lib/benchmark/mock-engine";
import type { RunBenchmarkRequest } from "@/lib/benchmark/types";
import { runAnthropicBenchmark } from "@/lib/anthropic/client";
import { runOpenAIBenchmark } from "@/lib/openai/client";
import { getProviderLabel } from "@/lib/benchmark/provider";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RunBenchmarkRequest;
    const runDate = new Date().toISOString();

    if (body.provider !== "openai" && body.provider !== "anthropic") {
      return NextResponse.json(
        { error: "Only OpenAI and Anthropic are supported in this benchmark." },
        { status: 400 },
      );
    }

    if (!body.model?.trim()) {
      return NextResponse.json(
        { error: "A model name is required before running the benchmark." },
        { status: 400 },
      );
    }

    if (body.mode === "mock") {
      await new Promise((resolve) => {
        setTimeout(resolve, 1200);
      });

      return NextResponse.json({
        run: generateMockBenchmarkRun({
          provider: body.provider,
          model: body.model.trim(),
          runDate,
        }),
      });
    }

    if (!body.apiKey?.trim()) {
      return NextResponse.json(
        {
          error: `A ${getProviderLabel(body.provider)} API key is required for live benchmark mode.`,
        },
        { status: 400 },
      );
    }

    const run =
      body.provider === "openai"
        ? await runOpenAIBenchmark({
            apiKey: body.apiKey.trim(),
            provider: "openai",
            model: body.model.trim(),
            runDate,
          })
        : await runAnthropicBenchmark({
            apiKey: body.apiKey.trim(),
            provider: "anthropic",
            model: body.model.trim(),
            runDate,
          });

    return NextResponse.json({ run });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The benchmark run failed unexpectedly.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
