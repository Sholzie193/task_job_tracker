import OpenAI from "openai";

import { roleBenchmarks } from "@/data/roles";
import {
  aggregateBenchmarkRun,
  aggregateRoleResults,
  buildCombinedScore,
  clampScore,
  createBenchmarkMetadata,
  getTaskStatus,
} from "@/lib/benchmark/scoring";
import type {
  BenchmarkProvider,
  BenchmarkRunResult,
  HumanDependency,
  RoleBenchmarkConfig,
  TaskEvaluationResult,
} from "@/lib/benchmark/types";
import {
  buildOpenAITaskEvaluationPrompt,
  openAiTaskEvaluationSchema,
  openAiTaskEvaluationSystemPrompt,
} from "@/lib/openai/prompts";

const OPENAI_TIMEOUT_MS = 45_000;

type RawOpenAITaskEvaluation = {
  taskAutomationConfidence: number;
  autonomyConfidence: number;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
  humanDependency: HumanDependency;
};

function normalizeStringList(values: unknown, fallback: string) {
  if (!Array.isArray(values)) {
    return [fallback];
  }

  const cleaned = values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  return cleaned.length ? cleaned.slice(0, 3) : [fallback];
}

function normalizeRawEvaluation(
  role: RoleBenchmarkConfig,
  task: RoleBenchmarkConfig["tasks"][number],
  parsed: RawOpenAITaskEvaluation,
): TaskEvaluationResult {
  const taskAutomationConfidence = clampScore(parsed.taskAutomationConfidence);
  const autonomyConfidence = clampScore(parsed.autonomyConfidence);
  const combinedScore = buildCombinedScore(
    taskAutomationConfidence,
    autonomyConfidence,
  );

  return {
    taskId: task.id,
    taskTitle: task.title,
    taskDescription: task.description,
    difficulty: task.difficulty,
    expectedOutputType: task.expectedOutputType,
    taskAutomationConfidence,
    autonomyConfidence,
    combinedScore,
    reasoning:
      parsed.reasoning?.trim() ||
      `${role.name} requires additional evaluator reasoning for ${task.title}.`,
    strengths: normalizeStringList(
      parsed.strengths,
      "The model can still produce a useful first draft.",
    ),
    weaknesses: normalizeStringList(
      parsed.weaknesses,
      "Human review is still needed before acting on the output.",
    ),
    humanDependency: parsed.humanDependency,
    status: getTaskStatus(combinedScore),
  };
}

async function evaluateTaskWithOpenAI({
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
  const client = new OpenAI({
    apiKey,
    timeout: OPENAI_TIMEOUT_MS,
  });

  const response = await client.responses.create({
    model,
    instructions: openAiTaskEvaluationSystemPrompt,
    input: buildOpenAITaskEvaluationPrompt(role, task, model),
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "task_evaluation",
        strict: true,
        schema: openAiTaskEvaluationSchema,
      },
    },
  });

  const rawOutput = response.output_text?.trim();

  if (!rawOutput) {
    throw new Error(`OpenAI returned an empty result for ${role.name} / ${task.title}.`);
  }

  return normalizeRawEvaluation(
    role,
    task,
    JSON.parse(rawOutput) as RawOpenAITaskEvaluation,
  );
}

export async function runOpenAIBenchmark({
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
        await evaluateTaskWithOpenAI({
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

