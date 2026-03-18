import Anthropic from "@anthropic-ai/sdk";
import type { Message } from "@anthropic-ai/sdk/resources/messages/messages";

import { roleBenchmarks } from "@/data/roles";
import {
  aggregateBenchmarkRun,
  aggregateRoleResults,
  createBenchmarkMetadata,
} from "@/lib/benchmark/scoring";
import type {
  BenchmarkProvider,
  BenchmarkRunResult,
  RoleBenchmarkConfig,
} from "@/lib/benchmark/types";
import {
  buildTaskEvaluationPrompt,
  normalizeRawEvaluation,
  taskEvaluationJsonSchema,
  taskEvaluationSystemPrompt,
  type RawTaskEvaluation,
} from "@/lib/benchmark/evaluation";

const ANTHROPIC_TIMEOUT_MS = 45_000;

function getAnthropicTextContent(message: Message) {
  const textBlock = message.content.find((block) => block.type === "text");

  if (!textBlock || textBlock.type !== "text") {
    return null;
  }

  return textBlock.text?.trim() || null;
}

async function evaluateTaskWithAnthropic({
  apiKey,
  model,
  role,
  task,
}: {
  apiKey: string;
  model: string;
  role: RoleBenchmarkConfig;
  task: RoleBenchmarkConfig["tasks"][number];
}) {
  const client = new Anthropic({
    apiKey,
    timeout: ANTHROPIC_TIMEOUT_MS,
  });

  const message = await client.messages.create({
    model,
    max_tokens: 700,
    stream: false,
    temperature: 0.1,
    system: taskEvaluationSystemPrompt,
    output_config: {
      format: {
        type: "json_schema",
        schema: taskEvaluationJsonSchema,
      },
    },
    messages: [
      {
        role: "user",
        content: buildTaskEvaluationPrompt(role, task, model),
      },
    ],
  });

  const rawOutput = getAnthropicTextContent(message);

  if (!rawOutput) {
    throw new Error(`Anthropic returned an empty result for ${role.name} / ${task.title}.`);
  }

  return normalizeRawEvaluation(
    role,
    task,
    JSON.parse(rawOutput) as RawTaskEvaluation,
  );
}

export async function runAnthropicBenchmark({
  apiKey,
  provider,
  model,
  runDate,
}: {
  apiKey: string;
  provider?: BenchmarkProvider;
  model: string;
  runDate: string;
}): Promise<BenchmarkRunResult> {
  const roleResults = [];

  for (const role of roleBenchmarks) {
    const taskResults = [];

    for (const task of role.tasks) {
      taskResults.push(
        await evaluateTaskWithAnthropic({
          apiKey,
          model,
          role,
          task,
        }),
      );
    }

    roleResults.push(aggregateRoleResults(role, taskResults));
  }

  return aggregateBenchmarkRun(
    roleResults,
    createBenchmarkMetadata({
      provider,
      model,
      runDate,
      mode: "live",
    }),
  );
}
