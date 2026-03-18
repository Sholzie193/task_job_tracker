import { NextResponse } from "next/server";

import { generateMockBenchmarkRun } from "@/lib/benchmark/mock-engine";
import type { RunBenchmarkRequest } from "@/lib/benchmark/types";
import { runOpenAIBenchmark } from "@/lib/openai/client";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RunBenchmarkRequest;
    const runDate = new Date().toISOString();

    if (body.provider !== "openai") {
      return NextResponse.json(
        { error: "Only the OpenAI provider is supported in V1." },
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
          provider: "openai",
          model: body.model.trim(),
          runDate,
        }),
      });
    }

    if (!body.apiKey?.trim()) {
      return NextResponse.json(
        { error: "An OpenAI API key is required for live benchmark mode." },
        { status: 400 },
      );
    }

    const run = await runOpenAIBenchmark({
      apiKey: body.apiKey.trim(),
      provider: "openai",
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
