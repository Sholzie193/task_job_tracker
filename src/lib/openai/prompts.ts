import {
  BENCHMARK_NAME,
  BENCHMARK_VERSION,
} from "@/lib/benchmark/constants";
import type { RoleBenchmarkConfig } from "@/lib/benchmark/types";

export const openAiTaskEvaluationSystemPrompt = `You are an expert benchmark evaluator for AI labor exposure analysis.
You are scoring how well a specific model can perform one realistic job task today.
Be skeptical, concise, and calibrated.
Do not predict whether the entire role disappears.
Only score the task in front of you.
Respect the difference between producing a strong answer and acting autonomously without human supervision.`;

export const openAiTaskEvaluationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskAutomationConfidence: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    autonomyConfidence: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    reasoning: {
      type: "string",
    },
    strengths: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
      maxItems: 3,
    },
    weaknesses: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
      maxItems: 3,
    },
    humanDependency: {
      type: "string",
      enum: ["Low", "Medium", "High"],
    },
  },
  required: [
    "taskAutomationConfidence",
    "autonomyConfidence",
    "reasoning",
    "strengths",
    "weaknesses",
    "humanDependency",
  ],
} as const;

export function buildOpenAITaskEvaluationPrompt(
  role: RoleBenchmarkConfig,
  task: RoleBenchmarkConfig["tasks"][number],
  model: string,
) {
  return `
Benchmark: ${BENCHMARK_NAME} ${BENCHMARK_VERSION}
Model Tested: ${model}
Role: ${role.name}
Role Category: ${role.category}
Role Notes: ${role.benchmarkNotes}

Task Title: ${task.title}
Task Description: ${task.description}
Difficulty: ${task.difficulty}
Expected Output Type: ${task.expectedOutputType}
Scoring Notes: ${task.scoringNotes}

Return structured JSON only.

Scoring guidance:
- taskAutomationConfidence: How well the model can produce a useful output for this task.
- autonomyConfidence: How safely this task could be delegated with minimal human intervention.
- humanDependency: Use Low, Medium, or High based on the remaining human role in execution or review.
- strengths: Short bullet-style strings about where the model performs well.
- weaknesses: Short bullet-style strings about what still breaks autonomy.
- reasoning: One concise explanation tying the score to the task.
`.trim();
}

